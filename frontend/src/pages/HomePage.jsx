import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Button,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CameraComponent from '../components/CameraComponent';
import UploadComponent from '../components/UploadComponent';

const HomePage = ({ setLoading }) => {
  const [tabValue, setTabValue] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleImageCapture = (imageData) => {
    setPreviewImage(imageData);
  };

  const handleAnalyze = async () => {
    if (!previewImage || !isMounted) return;

    setLoading(true);
    setError(null);

    try {
      let file;
      if (typeof previewImage === 'string') {
        const response = await fetch(previewImage);
        const blob = await response.blob();
        file = new File([blob], 'plum.jpg', { type: 'image/jpeg' });
      } else {
        file = previewImage;
      }

      const formData = new FormData();
      formData.append('file', file);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      console.log('API URL:', apiUrl);

      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        throw new Error(errorData.detail || 'Erreur lors de l\'analyse');
      }

      const result = await response.json();

      navigate('/results', { 
        state: { 
          image: previewImage,
          apiResponse: result
        }
      });
    } catch (error) {
      console.error("Erreur API:", error);
      setError(error.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  if (!isMounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        <span style={{ color: '#4a8c5e' }}>JCIA</span> Classificateur de Prunes
      </Typography>

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newVal) => {
            setTabValue(newVal);
            setPreviewImage(null);
          }}
          variant="fullWidth"
        >
          <Tab label="📷 Utiliser la caméra" />
          <Tab label="📁 Téléverser une image" />
        </Tabs>
      </Paper>

      {previewImage ? (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Image à analyser
          </Typography>
          <Avatar
            src={typeof previewImage === 'string' ? previewImage : URL.createObjectURL(previewImage)}
            variant="rounded"
            sx={{ 
              width: '100%', 
              height: 'auto', 
              maxWidth: '400px',
              maxHeight: '400px',
              m: 'auto',
              border: '2px solid #4a8c5e'
            }}
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => setPreviewImage(null)}
              sx={{ px: 4 }}
            >
              Annuler
            </Button>
            <Button 
              variant="contained" 
              onClick={handleAnalyze}
              sx={{ px: 4 }}
              startIcon={<CheckCircle />}
            >
              Analyser
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {tabValue === 0 ? (
            <CameraComponent onCapture={handleImageCapture} />
          ) : (
            <UploadComponent onUpload={handleImageCapture} />
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ℹ️ Prenez une photo claire de la prune ou téléversez une image
            </Typography>
          </Box>
        </>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;