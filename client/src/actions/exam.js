import axios from 'axios';
import { setAlert } from './alert';
import {
  GENERATE_PDF_REQUEST,
  GENERATE_PDF_SUCCESS,
  GENERATE_PDF_FAIL
} from './types';

// Generate professional PDF
export const generateProfessionalPDF = (examId) => async (dispatch) => {
  try {
    dispatch({ type: GENERATE_PDF_REQUEST });
    
    const res = await axios.get(`/api/exams/${examId}/pdf/professional`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `exam_${examId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    dispatch({ type: GENERATE_PDF_SUCCESS });
    dispatch(setAlert('PDF generated successfully', 'success'));
  } catch (err) {
    dispatch({
      type: GENERATE_PDF_FAIL,
      payload: err.response?.data?.error || 'PDF generation failed'
    });
    dispatch(setAlert(err.response?.data?.error || 'PDF generation failed', 'error'));
  }
};

// Generate answer key PDF
export const generateAnswerKey = (examId) => async (dispatch) => {
  try {
    dispatch({ type: GENERATE_PDF_REQUEST });
    
    const res = await axios.get(`/api/exams/${examId}/pdf/answer-key`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `exam_${examId}_answer_key.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    dispatch({ type: GENERATE_PDF_SUCCESS });
    dispatch(setAlert('Answer key generated successfully', 'success'));
  } catch (err) {
    dispatch({
      type: GENERATE_PDF_FAIL,
      payload: err.response?.data?.error || 'Answer key generation failed'
    });
    dispatch(setAlert(err.response?.data?.error || 'Answer key generation failed', 'error'));
  }
};