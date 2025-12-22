'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserTournaments } from '../../firebase/firestore';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
} from '@mui/material';
import {
  EmojiEvents,
  TrendingUp,
  AccountBalanceWallet,
  Stars,
} from '@mui/icons-material';

interface UserStats {
  tournamentsParticipated: number;
  tournamentsWon: number;
  currentRank: string;
  totalEarnings: number;
}

export default function StatsCards() {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?.uid) return;

      try {
        // Get user tournaments from Firestore
        const tournaments = await getUserTournaments(user.uid);
        
        // Calculate stats from real data
        const tournamentsParticipated = tournaments.length;
        const tournamentsWon = tournaments.filter(t => t.winner === user.uid).length;
        
        // Get stats from user profile or calculate
        const currentRank = userProfile?.stats?.currentRank || 'Bronze';
        const totalEarnings = userProfile?.stats?.totalEarnings || 0;

        setStats({
          tournamentsParticipated,
          tournamentsWon,
          currentRank,
          totalEarnings,
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Fallback to profile data or zeros
        setStats({
          tournamentsParticipated: userProfile?.stats?.tournamentsParticipated || 0,
          tournamentsWon: userProfile?.stats?.tournamentsWon || 0,
          currentRank: userProfile?.stats?.currentRank || 'Bronze',
          totalEarnings: userProfile?.stats?.totalEarnings || 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user, userProfile]);

  const statCards = [
    {
      title: 'Tournaments Participated',
      value: stats?.tournamentsParticipated || 0,
      icon: EmojiEvents,
      color: '#1976d2',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Tournaments Won',
      value: stats?.tournamentsWon || 0,
      icon: TrendingUp,
      color: '#2e7d32',
      bgColor: '#e8f5e8',
    },
    {
      title: 'Current Rank',
      value: stats?.currentRank || 'Bronze',
      icon: Stars,
      color: '#ed6c02',
      bgColor: '#fff3e0',
    },
    {
      title: 'Total Earnings',
      value: `₹${stats?.totalEarnings || 0}`,
      icon: AccountBalanceWallet,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card
              sx={{
                background: '#FFFFFF',
                borderRadius: 3,
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
              }}
            >
              <CardContent>
                <Skeleton variant="circular" width={48} height={48} />
                <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              background: '#FFFFFF',
              borderRadius: 3,
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <card.icon sx={{ color: card.color, fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: '#666', fontSize: 12, fontWeight: 500 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ color: '#333', fontWeight: 700, lineHeight: 1.2 }}
                  >
                    {card.value}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}