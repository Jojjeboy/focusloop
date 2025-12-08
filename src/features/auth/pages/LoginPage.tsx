import React, { useState } from 'react';
import { Box, Button, Container, Typography, Paper, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../../core/context/AuthContext';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C12 2 8 6 8 10C8 12.21 9.79 14 12 14C14.21 14 16 12.21 16 10C16 6 12 2 12 2ZM12 22C12 22 16 18 16 14C16 11.79 14.21 10 12 10C9.79 10 8 11.79 8 14C8 18 12 22 12 22Z"
                fill="white"
                fillOpacity="0.9"
              />
            </svg>
          </Box>

          <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#1F2937' }}>
            FocusLoop
          </Typography>

          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
            Master your productivity flow
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              py: 1.5,
              bgcolor: 'white',
              color: '#757575',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              border: '1px solid #dadce0',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#f8f9fa',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderColor: '#dadce0',
              },
            }}
          >
            Sign in with Google
          </Button>

          <Typography variant="caption" sx={{ mt: 4, color: 'text.disabled' }}>
            © 2024 FocusLoop. All rights reserved.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
