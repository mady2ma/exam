const Exam = require('../models/Exam');
const EnhancedPdfService = require('../services/EnhancedPdfService');
const LatexService = require('../services/LatexService');
const { validationResult } = require('express-validator');

exports.createExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const exam = new Exam({
      ...req.body,
      createdBy: req.user.id
    });

    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generatePdf = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate('school')
      .populate('createdBy', 'name');
    
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const pdfService = new EnhancedPdfService();
    const pdf = await pdfService.generate(exam);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${exam.title.replace(/\s+/g, '_')}.pdf`
    });
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateAnswerKey = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    const pdfService = new EnhancedPdfService();
    const pdf = await pdfService.generateAnswerKey(exam);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${exam.title.replace(/\s+/g, '_')}_Answer_Key.pdf`
    });
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
