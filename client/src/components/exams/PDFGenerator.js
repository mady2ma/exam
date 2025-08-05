import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@material-ui/core';
import { generateProfessionalPDF, generateAnswerKey } from '../../actions/exam';

const PDFGenerator = ({ examId, open, onClose }) => {
  const [format, setFormat] = useState('professional');
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.exam);

  const handleGenerate = () => {
    if (format === 'professional') {
      dispatch(generateProfessionalPDF(examId));
    } else if (format === 'answer_key') {
      dispatch(generateAnswerKey(examId));
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Generate PDF</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>PDF Format</InputLabel>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            label="PDF Format"
          >
            <MenuItem value="professional">Professional Exam Paper</MenuItem>
            <MenuItem value="answer_key">Answer Key</MenuItem>
            <MenuItem value="template">Blank Template</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button 
          onClick={handleGenerate} 
          color="primary" 
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PDFGenerator;