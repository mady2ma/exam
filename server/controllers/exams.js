const Exam = require('../models/Exam');
const PDFGenerator = require('../services/pdfGenerator');
const { validationResult } = require('express-validator');

// @desc    Generate professional PDF for exam
exports.generateProfessionalPDF = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('school', 'name logo');
    
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    const pdfGenerator = new PDFGenerator();
    
    // Set school logo if available
    if (exam.school?.logo) {
      pdfGenerator.schoolLogo = exam.school.logo;
    }
    
    const pdfBytes = await pdfGenerator.generate(exam);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${exam.title.replace(/ /g, '_')}.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      details: err.message 
    });
  }
};

// @desc    Generate answer key PDF
exports.generateAnswerKey = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ msg: 'Exam not found' });
    }

    const pdfGenerator = new PDFGenerator();
    const pdfBytes = await pdfGenerator.generateAnswerKey(exam);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${exam.title.replace(/ /g, '_')}_Answer_Key.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Answer key generation error:', err);
    res.status(500).json({ 
      error: 'Failed to generate answer key',
      details: err.message 
    });
  }
};