'use client';

import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { People, SportsEsports } from '@mui/icons-material';

export default function PlatformSnapshot() {
  const stats = [
    {
      title: 'Active Players',
      value: '100+',
      icon: People,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Supported Games',
      value: '2',
      icon: SportsEsports,
      color: '#2e7d32',
      bgColor: '#e8f5e8',
    },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={6} key={index}>
          <Card
            sx={{
              borderRadius: 3,
              background: '#FFFFFF',
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.06), -6px -6px 12px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
              {/* Icon */}
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)',
                }}
              >
                <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
              </Box>

              {/* Value */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#333',
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                {stat.value}
              </Typography>

              {/* Title */}
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}