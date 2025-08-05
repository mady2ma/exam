import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Box,
  Grid
} from '@material-ui/core';
import { createExam, generatePDF } from '../../actions/exam';

const ExamEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [exam, setExam] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'multiple_choice',
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
    difficulty: 'medium'
  });

  const handleExamChange = e => {
    setExam({ ...exam, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = e => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const addQuestion = () => {
    setExam({
      ...exam,
      questions: [...exam.questions, currentQuestion]
    });
    setCurrentQuestion({
      type: 'multiple_choice',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1,
      difficulty: 'medium'
    });
  };

  const handleSubmit = () => {
    dispatch(createExam(exam, navigate));
  };

  const handleGeneratePDF = () => {
    dispatch(generatePDF(id));
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? 'Edit Exam' : 'Create New Exam'}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Exam Title"
            name="title"
            value={exam.title}
            onChange={handleExamChange}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Subject"
            name="subject"
            value={exam.subject}
            onChange={handleExamChange}
          />
        </Grid>
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Grade Level"
            name="gradeLevel"
            value={exam.gradeLevel}
            onChange={handleExamChange}
          />
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Add Questions
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Select
              name="type"
              value={currentQuestion.type}
              onChange={handleQuestionChange}
            >
              <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
              <MenuItem value="true_false">True/False</MenuItem>
              <MenuItem value="short_answer">Short Answer</MenuItem>
              <MenuItem value="essay">Essay</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Question Text"
            name="questionText"
            value={currentQuestion.questionText}
            onChange={handleQuestionChange}
          />
        </Grid>
        
        {currentQuestion.type === 'multiple_choice' && (
          <>
            {currentQuestion.options.map((option, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  value={option}
                  onChange={e => handleOptionChange(index, e.target.value)}
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Correct Answer</InputLabel>
                <Select
                  name="correctAnswer"
                  value={currentQuestion.correctAnswer}
                  onChange={handleQuestionChange}
                >
                  {currentQuestion.options.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      Option {index + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </>
        )}
        
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="number"
            label="Marks"
            name="marks"
            value={currentQuestion.marks}
            onChange={handleQuestionChange}
          />
        </Grid>
        
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Difficulty</InputLabel>
            <Select
              name="difficulty"
              value={currentQuestion.difficulty}
              onChange={handleQuestionChange}
            >
              <MenuItem value="easy">Easy</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={addQuestion}
          >
            Add Question
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Save Exam
            </Button>
            
            {isEdit && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleGeneratePDF}
              >
                Generate PDF
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ExamEditor;