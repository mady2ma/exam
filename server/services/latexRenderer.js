const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

module.exports = {
  async renderEquationToSVG(equation) {
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const texContent = `\\documentclass[preview]{standalone}
\\usepackage{amsmath}
\\begin{document}
\\( ${equation} \\)
\\end{document}`;

    const texFilePath = path.join(tempDir, 'equation.tex');
    fs.writeFileSync(texFilePath, texContent);

    try {
      // Convert LaTeX to DVI then to SVG
      await execPromise(`latex -output-directory=${tempDir} ${texFilePath}`);
      await execPromise(`dvisvgm --no-fonts ${path.join(tempDir, 'equation.dvi')} -o ${path.join(tempDir, 'equation.svg')}`);
      
      const svgContent = fs.readFileSync(path.join(tempDir, 'equation.svg'), 'utf-8');
      
      // Cleanup
      fs.unlinkSync(texFilePath);
      fs.unlinkSync(path.join(tempDir, 'equation.dvi'));
      fs.unlinkSync(path.join(tempDir, 'equation.svg'));
      fs.unlinkSync(path.join(tempDir, 'equation.log'));

      return svgContent;
    } catch (error) {
      console.error('LaTeX rendering error:', error);
      throw new Error('Failed to render equation');
    }
  }
};