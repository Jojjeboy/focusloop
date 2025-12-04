import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * AppButton - Reusable button component with consistent styling
 */

interface AppButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
  type?: 'button' | 'submit' | 'reset';
}

export const AppButton: React.FC<AppButtonProps> = ({
  children,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  sx,
  type = 'button',
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
      endIcon={endIcon}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        px: size === 'large' ? 3 : size === 'small' ? 1.5 : 2,
        py: size === 'large' ? 1.5 : size === 'small' ? 0.75 : 1,
        boxShadow: variant === 'contained' ? 2 : 0,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: variant === 'contained' ? 4 : 1,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        '&.Mui-disabled': {
          opacity: 0.6,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default AppButton;
