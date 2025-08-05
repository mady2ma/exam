import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button, Box, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreview = ({ examId }) => {
  const [numPages, setNumPages] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generatePreview = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/exams/${examId}/preview`);
        const blob = await response.blob();
        setPdfUrl(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Preview generation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      generatePreview();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [examId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const downloadPdf = async () => {
    window.open(`/api/exams/${examId}/pdf`, '_blank');
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Exam Preview
      </Typography>
      
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={downloadPdf}
        sx={{ mb: 2 }}
      >
        Download PDF
      </Button>

      {loading ? (
        <Typography>Generating preview...</Typography>
      ) : (
        <Box sx={{ border: '1px solid #ddd', p: 1 }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={600}
              />
            ))}
          </Document>
        </Box>
      )}
    </Box>
  );
};

export default PdfPreview;