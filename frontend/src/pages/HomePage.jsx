import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Button,
  CircularProgress,
  Avatar
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CameraComponent from '../components/CameraComponent';
import UploadComponent from '../components/UploadComponent';

const HomePage = ({ setLoading }) => {
  const [tabValue, setTabValue] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
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
    
    // Simulation d'analyse
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults = {
      image: previewImage,
      prediction: ['Bonne qualité', 'Non mûre', 'Tachetée', 'Fissurée', 'Meurtrie', 'Pourrie'][
        Math.floor(Math.random() * 6)
      ],
      confidence: Math.random() * 30 + 70,
    };
    
    if (isMounted) {
      navigate('/results', { state: mockResults });
    }
    setLoading(false);
  };

  if (!isMounted) return null;

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
    </Box>
  );
};

export default HomePage;