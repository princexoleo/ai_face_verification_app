import React, { useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button, Box, Paper } from '@mui/material';

const WebcamCapture = ({ onCapture, label, capturedImage }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      {capturedImage ? (
        <Paper sx={{ p: 1 }}>
          <img 
            src={capturedImage} 
            alt="Captured" 
            style={{ width: 320, height: 240 }}
          />
        </Paper>
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          mirrored={false}
        />
      )}
      
      <Button 
        variant="contained" 
        onClick={capture} 
        sx={{ width: '200px' }}
      >
        {capturedImage ? `Retake ${label}` : `Capture ${label}`}
      </Button>
    </Box>
  );
};

export default WebcamCapture; 