import React from 'react';
import { Card, CardContent, CardActions, CardHeader } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * AppCard - Reusable card component with consistent styling
 */

interface AppCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  elevation?: number;
  sx?: SxProps<Theme>;
  headerAction?: React.ReactNode;
  variant?: 'elevation' | 'outlined';
}

export const AppCard: React.FC<AppCardProps> = ({
  title,
  subtitle,
  children,
  actions,
  elevation = 2,
  sx,
  headerAction,
  variant = 'elevation',
}) => {
  return (
    <Card
      elevation={elevation}
      variant={variant}
      sx={{
        borderRadius: 2,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[elevation + 2],
        },
        ...sx,
      }}
    >
      {(title || subtitle) && (
        <CardHeader
          title={title}
          subheader={subtitle}
          action={headerAction}
          sx={{
            '& .MuiCardHeader-title': {
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'text.primary',
            },
            '& .MuiCardHeader-subheader': {
              fontSize: '0.875rem',
              color: 'text.secondary',
            },
          }}
        />
      )}
      <CardContent>{children}</CardContent>
      {actions && <CardActions sx={{ px: 2, pb: 2 }}>{actions}</CardActions>}
    </Card>
  );
};

export default AppCard;
