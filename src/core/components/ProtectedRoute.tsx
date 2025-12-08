import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { LoginPage } from '../../features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#FAFBFC',
        }}
      >
        <CircularProgress sx={{ color: '#9333EA' }} />
      </Box>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
};
