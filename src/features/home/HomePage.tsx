import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { AppCard } from '../../shared/components/AppCard';

export const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Welcome to FocusLoop
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your productivity companion
        </Typography>
      </Box>

      <AppCard title="Getting Started">
        <Typography variant="body1" paragraph>
          FocusLoop helps you stay productive with customizable timer combinations.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Navigate to the Timers page to create your first timer combination and start focusing!
        </Typography>
      </AppCard>
    </Container>
  );
};

export default HomePage;
