import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Box } from '@mui/material';
import { CameraAlt } from '@mui/icons-material';

const CameraComponent = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ 
          width: '100%', 
          maxWidth: '500px', 
          borderRadius: '8px',
          border: '2px solid #4a8c5e'
        }}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<CameraAlt />}
        onClick={capture}
        sx={{ width: '200px' }}
      >
        Prendre une photo
      </Button>
    </Box>
  );
};

export default CameraComponent;