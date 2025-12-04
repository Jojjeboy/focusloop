import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { AppCard } from '../../shared/components/AppCard';

export const SettingsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your FocusLoop experience
        </Typography>
      </Box>

      <AppCard title="Application Settings">
        <Typography variant="body2" color="text.secondary">
          Settings options coming soon...
        </Typography>
      </AppCard>
    </Container>
  );
};

export default SettingsPage;
