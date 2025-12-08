import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

interface StatsCardsProps {
  activeCount: number;
  completedCount: number;
  totalTime: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  activeCount,
  completedCount,
  totalTime,
}) => {
  const stats = [
    { value: activeCount, label: 'Active', color: '#9333EA' },
    { value: completedCount, label: 'Completed', color: '#EC4899' },
    { value: totalTime, label: 'Total Time', color: '#06B6D4' },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={4} key={index}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: stat.color,
                mb: 0.5,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontSize: '0.75rem',
              }}
            >
              {stat.label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
