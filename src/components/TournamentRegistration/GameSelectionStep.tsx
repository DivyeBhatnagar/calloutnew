'use client';

import { useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Image from 'next/image';

interface GameSelectionStepProps {
  onSelect: (game: string) => void;
  onBack: () => void;
  selectedGame: string;
}

const games = [
  {
    id: 'BGMI',
    name: 'BGMI',
    logo: '/Media/Game Titles/BGMI.jpeg',
    description: 'Battle Royale Championship',
  },
  {
    id: 'FREE_FIRE_MAX',
    name: 'Free Fire MAX',
    logo: '/Media/Game Titles/FREEFIRE_MAX.png',
    description: 'Ultimate Battle Arena',
  },
];

export default function GameSelectionStep({ onSelect, onBack, selectedGame }: GameSelectionStepProps) {
  const [selected, setSelected] = useState(selectedGame);

  const handleGameClick = (gameId: string) => {
    setSelected(gameId);
    // Auto-navigate after selection
    setTimeout(() => {
      onSelect(gameId);
    }, 300);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
          }}
        >
          Choose Your Game
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: 16,
          }}
        >
          Select the game you want to compete in
        </Typography>
      </Box>

      {/* Games Grid */}
      <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center' }}>
        {games.map((game) => (
          <Grid item xs={12} sm={6} key={game.id}>
            <Card
              onClick={() => handleGameClick(game.id)}
              sx={{
                cursor: 'pointer',
                borderRadius: 4,
                background: '#FFFFFF',
                border: selected === game.id ? '3px solid #1976d2' : '1px solid #f0f0f0',
                boxShadow: selected === game.id 
                  ? '12px 12px 24px rgba(25, 118, 210, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
                  : '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease-in-out',
                minHeight: 280,
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '16px 16px 32px rgba(0, 0, 0, 0.12), -16px -16px 32px rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Game Logo */}
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 3,
                    overflow: 'hidden',
                    margin: '0 auto 2rem auto',
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <Image
                    src={game.logo}
                    alt={game.name}
                    width={120}
                    height={120}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>

                {/* Game Name */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#333',
                    mb: 1,
                  }}
                >
                  {game.name}
                </Typography>

                {/* Game Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: 14,
                  }}
                >
                  {game.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 500,
            borderColor: '#ddd',
            color: '#666',
            '&:hover': {
              borderColor: '#1976d2',
              color: '#1976d2',
              background: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          Back
        </Button>
      </Box>
    </Box>
  );
}