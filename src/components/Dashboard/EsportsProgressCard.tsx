'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  EmojiEvents,
} from '@mui/icons-material';

const ranks = [
  { name: 'Bronze', color: '#cd7f32', min: 0, max: 2 },
  { name: 'Silver', color: '#c0c0c0', min: 3, max: 5 },
  { name: 'Gold', color: '#ffd700', min: 6, max: 10 },
  { name: 'Platinum', color: '#e5e4e2', min: 11, max: 20 },
  { name: 'Diamond', color: '#b9f2ff', min: 21, max: 50 },
];

export default function EsportsProgressCard() {
  const { userProfile } = useAuth();
  const [tournamentsCount, setTournamentsCount] = useState(0);
  const [currentRank, setCurrentRank] = useState('Bronze');
  const [nextRank, setNextRank] = useState('Silver');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Get tournaments participated from user profile or calculate from registrations
    const participated = userProfile?.stats?.tournamentsParticipated || 0;
    setTournamentsCount(participated);

    // Calculate rank based on tournaments participated
    let rank = ranks[0];
    let nextRankInfo = ranks[1];

    for (let i = 0; i < ranks.length; i++) {
      if (participated >= ranks[i].min && participated <= ranks[i].max) {
        rank = ranks[i];
        nextRankInfo = ranks[i + 1] || ranks[i]; // If at max rank, stay at current
        break;
      }
    }

    setCurrentRank(rank.name);
    setNextRank(nextRankInfo.name);

    // Calculate progress to next rank
    if (nextRankInfo !== rank) {
      const progressInCurrentRank = participated - rank.min;
      const totalNeededForNext = nextRankInfo.min - rank.min;
      const progressPercentage = Math.min((progressInCurrentRank / totalNeededForNext) * 100, 100);
      setProgress(progressPercentage);
    } else {
      setProgress(100); // Max rank achieved
    }
  }, [userProfile]);

  const getCurrentRankColor = () => {
    const rank = ranks.find(r => r.name === currentRank);
    return rank?.color || '#cd7f32';
  };

  const getNextRankColor = () => {
    const rank = ranks.find(r => r.name === nextRank);
    return rank?.color || '#c0c0c0';
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        color: 'white',
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Esports Progress
            </Typography>
          </Box>
          <Chip
            label={`${tournamentsCount} Tournaments`}
            icon={<EmojiEvents sx={{ fontSize: 16 }} />}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 600,
              fontSize: 12,
            }}
          />
        </Box>

        {/* Rank Progression */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: getCurrentRankColor(),
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {currentRank}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              →
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: getNextRankColor(),
                  boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
                }}
              />
              <Typography variant="body1" sx={{ fontWeight: 600, opacity: currentRank === nextRank ? 0.6 : 1 }}>
                {nextRank}
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 1) 100%)',
              },
            }}
          />
        </Box>

        {/* Progress Text */}
        <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
          {currentRank === nextRank 
            ? 'Maximum rank achieved! 🏆'
            : `${Math.round(progress)}% progress to ${nextRank}`
          }
        </Typography>
      </CardContent>
    </Card>
  );
}