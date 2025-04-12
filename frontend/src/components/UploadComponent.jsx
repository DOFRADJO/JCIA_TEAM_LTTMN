import React from 'react';
import { Button, Box, Typography } from '@mui/material'; // Ajout de Typography ici
import { CloudUpload } from '@mui/icons-material';

const UploadComponent = ({ onUpload }) => {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(file);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        id="plum-upload-input"
      />
      <label htmlFor="plum-upload-input">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUpload />}
        >
          Choisir une image
        </Button>
      </label>
      <Typography variant="body2" color="text.secondary">
        Formats supportés: JPG, PNG
      </Typography>
    </Box>
  );
};

export default UploadComponent;