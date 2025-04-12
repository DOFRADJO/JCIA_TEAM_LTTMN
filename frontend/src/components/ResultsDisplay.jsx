import React from 'react';
import { Box, Typography, Paper, Chip, LinearProgress } from '@mui/material';

const plumStatus = {
  'Bonne qualité': { color: 'success', emoji: '🍇' },
  'Non mûre': { color: 'info', emoji: '🍏' },
  'Tachetée': { color: 'warning', emoji: '🔴' },
  'Fissurée': { color: 'warning', emoji: '⚡' },
  'Meurtrie': { color: 'error', emoji: '💢' },
  'Pourrie': { color: 'error', emoji: '🤢' },
};

const ResultsDisplay = ({ image, prediction, confidence, loading }) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Analyse en cours...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (!prediction) return null;

  const status = plumStatus[prediction] || { color: 'default', emoji: '❓' };

  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%', maxWidth: '500px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {image && (
          <img
            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
            alt="Analyzed plum"
            style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }}
          />
        )}
        <Typography variant="h5" component="div">
          Résultat: <Chip
            label={`${status.emoji} ${prediction}`}
            color={status.color}
            size="medium"
            sx={{ fontSize: '1.1rem', px: 1 }}
          />
        </Typography>
        <Typography variant="body1">
          Confiance: {(confidence * 100).toFixed(2)}%
        </Typography>
      </Box>
    </Paper>
  );
};

export default ResultsDisplay;