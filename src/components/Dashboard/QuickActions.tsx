'use client';

import { useRouter } from 'next/navigation';
import { Button, Box } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

export default function QuickActions() {
  const router = useRouter();

  const handleJoinTournament = () => {
    router.push('/dashboard/tournaments');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<EmojiEvents />}
        onClick={handleJoinTournament}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 3,
          textTransform: 'none',
          fontSize: 16,
          fontWeight: 600,
          background: '#1976d2',
          color: '#fff',
          boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
          '&:hover': {
            background: '#1565c0',
            boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.12), -4px -4px 8px rgba(255, 255, 255, 0.9)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
            transform: 'translateY(0)',
          },
        }}
      >
        Join Tournament
      </Button>
    </Box>
  );
}