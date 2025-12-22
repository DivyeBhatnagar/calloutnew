'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

interface EventLandingStepProps {
  onContinue: () => void;
}

export default function EventLandingStep({ onContinue }: EventLandingStepProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper
        sx={{
          p: 6,
          borderRadius: 4,
          background: '#FFFFFF',
          boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.1), -12px -12px 24px rgba(255, 255, 255, 0.9)',
          border: '1px solid #f0f0f0',
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
        }}
      >
        {/* Event Logo Placeholder */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 3rem auto',
            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
          }}
        >
          <EmojiEvents sx={{ fontSize: 60, color: '#fff' }} />
        </Box>

        {/* Event Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem' },
          }}
        >
          Campus Showdown
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#666',
            mb: 4,
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          Join the ultimate esports tournament and compete with the best players from top colleges
        </Typography>

        {/* Continue Button */}
        <Button
          variant="contained"
          size="large"
          onClick={onContinue}
          sx={{
            px: 6,
            py: 2,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: 18,
            fontWeight: 600,
            background: '#1976d2',
            color: '#fff',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            '&:hover': {
              background: '#1565c0',
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.12), -6px -6px 12px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
              transform: 'translateY(0)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Continue
        </Button>
      </Paper>
    </Box>
  );
}