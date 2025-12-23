'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  SportsEsports,
} from '@mui/icons-material';

interface Game {
  id: string;
  name: string;
  logoUrl: string;
}

interface Tournament {
  id: string;
  name: string;
  games: Game[];
}

interface DynamicGameSelectionStepProps {
  tournament: Tournament;
  selectedCollege: string;
  onSelect: (game: string) => void;
  onBack: () => void;
  selectedGame?: string;
}

export default function DynamicGameSelectionStep({
  tournament,
  selectedCollege,
  onSelect,
  onBack,
  selectedGame,
}: DynamicGameSelectionStepProps) {
  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
          }}
        >
          Select Your Game
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            fontWeight: 400,
            mb: 2,
          }}
        >
          Choose your game for {tournament.name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`College: ${selectedCollege}`}
            sx={{
              background: '#e8f5e8',
              color: '#2e7d32',
              fontWeight: 600,
            }}
          />
          <Chip
            label={`${tournament.games.length} Games Available`}
            sx={{
              background: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 600,
            }}
          />
        </Box>
      </Box>

      {/* Back Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Back to College Selection
        </Button>
      </Box>

      {/* Games Grid */}
      <Grid container spacing={4}>
        {tournament.games.map((game) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={game.id}>
            <Card
              sx={{
                borderRadius: 3,
                background: '#FFFFFF',
                boxShadow: selectedGame === game.name
                  ? '12px 12px 24px rgba(25, 118, 210, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
                  : '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                border: selectedGame === game.name
                  ? '2px solid #1976d2'
                  : '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => onSelect(game.name)}
            >
              {/* Selected Indicator */}
              {selectedGame === game.name && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                >
                  <CheckCircle sx={{ color: '#1976d2', fontSize: 24 }} />
                </Box>
              )}

              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {/* Game Logo */}
                <Box sx={{ mb: 2 }}>
                  <img
                    src={game.logoUrl}
                    alt={game.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      borderRadius: 12,
                    }}
                  />
                </Box>

                {/* Game Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 2,
                    lineHeight: 1.3,
                    minHeight: 48, // Consistent height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {game.name}
                </Typography>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant={selectedGame === game.name ? 'contained' : 'outlined'}
                  startIcon={selectedGame === game.name ? <CheckCircle /> : <SportsEsports />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    boxShadow: selectedGame === game.name
                      ? '4px 4px 8px rgba(25, 118, 210, 0.2)'
                      : 'none',
                  }}
                >
                  {selectedGame === game.name ? 'Selected' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Continue Button */}
      {selectedGame && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => onSelect(selectedGame)}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              px: 6,
              py: 2,
              fontSize: 18,
              boxShadow: '8px 8px 16px rgba(25, 118, 210, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            }}
          >
            Continue with {selectedGame}
          </Button>
        </Box>
      )}
    </Box>
  );
}