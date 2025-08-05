const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

class EnhancedPdfService {
  constructor() {
    this.doc = null;
    this.page = null;
    this.fonts = {};
  }

  async init() {
    this.doc = await PDFDocument.create();
    this.doc.registerFontkit(fontkit);
    
    // Embed standard fonts
    this.fonts.regular = await this.doc.embedFont(StandardFonts.Helvetica);
    this.fonts.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    
    // Create first page
    this.addNewPage();
  }

  addNewPage() {
    this.page = this.doc.addPage([595, 842]); // A4 size
    this.yPosition = 750; // Start position
    this.margin = 50;
  }

  async addSchoolHeader(school) {
    const { width } = this.page.getSize();
    
    // School name
    this.page.drawText(school.name, {
      x: this.margin,
      y: this.yPosition,
      size: 16,
      font: this.fonts.bold,
    });
    
    // Exam title and metadata
    this.yPosition -= 40;
  }

  async addQuestion(question, number) {
    if (this.yPosition < 100) {
      this.addNewPage();
    }

    // Question number and text
    this.page.drawText(`${number}. ${question.text}`, {
      x: this.margin,
      y: this.yPosition,
      size: 12,
      font: this.fonts.bold,
      maxWidth: 500,
    });
    this.yPosition -= 20;

    // Handle different question types
    switch (question.type) {
      case 'multiple_choice':
        await this.addMultipleChoice(question);
        break;
      case 'essay':
        await this.addEssayAnswerSpace(question);
        break;
      // Add other question types
    }
    
    this.yPosition -= 15; // Space between questions
  }

  async generate(exam) {
    await this.init();
    await this.addSchoolHeader(exam.school);
    
    // Add instructions
    this.page.drawText('Instructions: ' + exam.instructions, {
      x: this.margin,
      y: this.yPosition,
      size: 12,
      font: this.fonts.regular,
      maxWidth: 500,
    });
    this.yPosition -= 40;

    // Add questions
    exam.questions.forEach((q, i) => {
      this.addQuestion(q, i+1);
    });

    return await this.doc.save();
  }
}
