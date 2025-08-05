const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay', 'matching', 'diagram'],
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: [String],
  correctAnswer: mongoose.Schema.Types.Mixed,
  marks: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const ExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  subject: {
    type: String,
    required: true
  },
  gradeLevel: {
    type: String,
    required: true
  },
  duration: Number, // in minutes
  instructions: String,
  questions: [QuestionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isTemplate: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Exam', ExamSchema);