const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const execPromise = util.promisify(exec);

module.exports = class LatexService {
  constructor() {
    this.tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir);
    }
  }

  async renderEquation(equation) {
    const texFilePath = path.join(this.tempDir, 'equation.tex');
    const texContent = `\\documentclass[preview]{standalone}
\\usepackage{amsmath}
\\begin{document}
\\( ${equation} \\)
\\end{document}`;

    fs.writeFileSync(texFilePath, texContent);

    try {
      // Convert LaTeX to DVI then to SVG
      await execPromise(`latex -output-directory=${this.tempDir} ${texFilePath}`);
      await execPromise(`dvisvgm --no-fonts ${path.join(this.tempDir, 'equation.dvi')} -o ${path.join(this.tempDir, 'equation.svg')}`);
      
      const svgContent = fs.readFileSync(path.join(this.tempDir, 'equation.svg'), 'utf-8');
      this.cleanup();
      return svgContent;
    } catch (error) {
      this.cleanup();
      throw error;
    }
  }

  cleanup() {
    const files = ['equation.tex', 'equation.dvi', 'equation.svg', 'equation.log'];
    files.forEach(file => {
      const filePath = path.join(this.tempDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
};
