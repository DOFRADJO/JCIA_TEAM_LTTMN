import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Chip, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  LinearProgress,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  ArrowBack, 
  CheckCircle, 
  Warning,
  ThumbUp,
  ThumbDown,
  LocalFlorist,
  LocalHospital,
  Delete
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const statusData = {
  'unaffected': {
    label: 'Bonne qualité',
    icon: <CheckCircle color="success" sx={{ mr: 1 }} />,
    color: 'success',
    recommendations: [
      "✅ Qualité excellente - Prête à être consommée",
      "Aucun défaut détecté",
      "Peut être conservée 3-5 jours au réfrigérateur"
    ]
  },
  'unripe': {
    label: 'Non mûre',
    icon: <LocalFlorist color="info" sx={{ mr: 1 }} />,
    color: 'info',
    recommendations: [
      "⏳ Pas encore à maturité",
      "Laisser mûrir 2-3 jours à température ambiante",
      "Conserver dans un sac en papier pour accélérer la maturation"
    ]
  },
  'spotted': {
    label: 'Tachetée',
    icon: <Warning color="warning" sx={{ mr: 1 }} />,
    color: 'warning',
    recommendations: [
      "⚠️ Taches superficielles détectées",
      "Laver soigneusement avant consommation",
      "Retirer les parties atteintes si nécessaire"
    ]
  },
  'cracked': {
    label: 'Fissurée',
    icon: <LocalHospital color="warning" sx={{ mr: 1 }} />,
    color: 'warning',
    recommendations: [
      "❗ Fissures détectées",
      "Vérifier l'absence de moisissures internes",
      "Idéale pour transformation immédiate"
    ]
  },
  'bruised': {
    label: 'Meurtrie',
    icon: <ThumbDown color="error" sx={{ mr: 1 }} />,
    color: 'error',
    recommendations: [
      "🛑 Dommages mécaniques importants",
      "Utiliser rapidement pour cuisiner",
      "Jeter les parties trop abîmées",
      "Ne pas conserver plus de 24h"
    ]
  },
  'rotten': {
    label: 'Pourrie',
    icon: <Delete color="error" sx={{ mr: 1 }} />,
    color: 'error',
    recommendations: [
      "☠️ DANGER - Non consommable",
      "Jeter immédiatement",
      "Désinfecter le contenant de stockage",
      "Vérifier les fruits adjacents"
    ]
  }
};

const ResultsPage = ({ setLoading }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMounted(true);
    if (!location.state) {
      setShouldRedirect(true);
    }
    return () => {
      setIsMounted(false);
      setLoading(false);
    };
  }, [location.state, setLoading]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate('/');
    }
  }, [shouldRedirect, navigate]);

  if (!isMounted) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!location.state?.apiResponse) {
    return null;
  }

  const { image, apiResponse } = location.state;
  const mainCategory = apiResponse.level2?.category || apiResponse.level1.category;
  const { label, icon, color, recommendations } = statusData[mainCategory] || statusData['unaffected'];
 // const qualityScore = apiResponse.quality_score || 0.8; // Valeur par défaut si non fournie

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '800px', 
      mx: 'auto', 
      p: 3,
      bgcolor: 'background.paper'
    }}>
      {/* <Button
        startIcon={<ArrowBack />}
        onClick={() => {
          setLoading(true);
          navigate('/');
        }}
        sx={{ mb: 3 }}
        variant="outlined"
        color="primary"
      >
        Nouvelle analyse
      </Button> */}
      
      <Paper elevation={3} sx={{ 
        p: 3, 
        mb: 3,
        borderLeft: `4px solid ${color === 'success' ? '#4caf50' : color === 'warning' ? '#ff9800' : '#f44336'}`
      }}>
        {image && (
          <Box sx={{ 
            textAlign: 'center', 
            mb: 3,
            position: 'relative'
          }}>
            <Avatar
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              variant="rounded"
              sx={{ 
                width: '100%', 
                height: 'auto', 
                maxWidth: '300px',
                maxHeight: '300px',
                m: 'auto',
                boxShadow: 3
              }}
            />
            <Chip
              label={label}
              color={color}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                fontSize: '1.3rem',
                fontWeight: 'bold'
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexGrow: 1
          }}>
            {icon}
            Diagnostic
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            bgcolor: 'action.hover',
            px: 2,
            py: 1,
            borderRadius: 1
          }}>
            <Typography variant="body1" sx={{ mr: 1 }}>
              Fiabilité:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {apiResponse.level1.confidence.toFixed(1)}%
            </Typography>
          </Box>
        </Box>

        <LinearProgress 
          variant="determinate" 
          value={apiResponse.level1.confidence} 
          color={color}
          sx={{ 
            height: 8, 
            borderRadius: 4,
            mb: 3
          }}
        />


        {apiResponse.level2 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Détail: {apiResponse.level2.description}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h5" gutterBottom sx={{ 
          mt: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <LocalFlorist sx={{ mr: 1, color: color }} />
          Recommandations
        </Typography>
        
        <List dense sx={{ 
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 1
        }}>
          {recommendations.map((rec, index) => (
            <ListItem key={index} sx={{ 
              alignItems: 'flex-start',
              borderBottom: index !== recommendations.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
              py: 1.5
            }}>
              <ListItemText 
                primary={rec.split(' - ')[0]} 
               // secondary={rec.split(' - ')[1] || rec} 
                primaryTypographyProps={{ 
                  fontWeight: 'medium',
                  color: rec.startsWith('✅') ? 'success.main' : 
                         rec.startsWith('⚠️') ? 'warning.main' : 
                         rec.startsWith('❗') ? 'error.main' : 'text.primary'
                }}
                secondaryTypographyProps={{ 
                  color: 'text.secondary',
                  whiteSpace: 'pre-line'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.print()}
          sx={{ 
            px: 4,
            bgcolor: '#4a8c5e',
            '&:hover': { bgcolor: '#3a6c4e' }
          }}
          startIcon={<ThumbUp />}
        >
          Sauvegarder le diagnostic
        </Button>
        <Button 
          variant="outlined"
          onClick={() => {
            setLoading(true);
            navigate('/');
          }}
          sx={{ px: 4 }}
          startIcon={<ArrowBack />}
        >
          Analyser une autre prune
        </Button>
      </Box>
    </Box>
  );
};

export default ResultsPage;