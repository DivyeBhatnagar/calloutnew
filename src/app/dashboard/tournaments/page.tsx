'use client';

import { useState, useEffect } from 'react';
import { getTournaments } from '../../../firebase/firestore';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  EmojiEvents,
  People,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';

interface Tournament {
  id: string;
  name: string;
  game: string;
  status: string;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  participants: string[];
  startDate: string;
  endDate: string;
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await getTournaments();
        setTournaments(data);
      } catch (error: any) {
        console.error('Error fetching tournaments:', error);
        setError('Failed to load tournaments. Please try again.');
        // Fallback to mock data for demo
        setTournaments([
          {
            id: '1',
            name: 'VALORANT College Championship 2024',
            game: 'VALORANT',
            status: 'Open',
            entryFee: 500,
            prizePool: 50000,
            maxParticipants: 32,
            participants: ['user1', 'user2'],
            startDate: '2024-12-25',
            endDate: '2024-12-30',
          },
          {
            id: '2',
            name: 'CS2 Winter Showdown',
            game: 'CS2',
            status: 'Upcoming',
            entryFee: 300,
            prizePool: 25000,
            maxParticipants: 16,
            participants: [],
            startDate: '2025-01-05',
            endDate: '2025-01-10',
          },
          {
            id: '3',
            name: 'BGMI Mobile Masters',
            game: 'BGMI',
            status: 'Live',
            entryFee: 200,
            prizePool: 15000,
            maxParticipants: 24,
            participants: ['user1'],
            startDate: '2024-12-20',
            endDate: '2024-12-25',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return { color: '#2e7d32', bg: '#e8f5e8' };
      case 'Live': return { color: '#1976d2', bg: '#e3f2fd' };
      case 'Upcoming': return { color: '#ed6c02', bg: '#fff3e0' };
      default: return { color: '#666', bg: '#f5f5f5' };
    }
  };

  const isTournamentFull = (tournament: Tournament) => {
    return tournament.participants.length >= tournament.maxParticipants;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Container maxWidth="lg">
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
              Tournaments
            </Typography>
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Skeleton variant="text" width="60%" height={30} />
                      <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                      <Skeleton variant="rectangular" height={100} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 1,
            }}
          >
            Tournaments
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 4,
            }}
          >
            Browse and join exciting esports tournaments
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {tournaments.map((tournament) => {
              const statusStyle = getStatusColor(tournament.status);
              const isFull = isTournamentFull(tournament);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={tournament.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      background: '#FFFFFF',
                      boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                      border: '1px solid #f0f0f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Chip
                          label={tournament.game}
                          sx={{
                            background: '#1976d2',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        />
                        <Chip
                          label={tournament.status}
                          sx={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        />
                      </Box>

                      {/* Tournament Name */}
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#333',
                          mb: 3,
                          lineHeight: 1.3,
                        }}
                      >
                        {tournament.name}
                      </Typography>

                      {/* Tournament Details */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoney sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            Entry: ₹{tournament.entryFee} • Prize: ₹{tournament.prizePool.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <People sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {tournament.participants.length}/{tournament.maxParticipants} participants
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {new Date(tournament.startDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Action Button */}
                      <Button
                        fullWidth
                        variant={tournament.status === 'Open' && !isFull ? 'contained' : 'outlined'}
                        disabled={tournament.status !== 'Open' || isFull}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.5,
                          boxShadow: tournament.status === 'Open' && !isFull
                            ? '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                            : 'none',
                        }}
                      >
                        {tournament.status === 'Live' ? 'Live Now' :
                         tournament.status === 'Upcoming' ? 'Coming Soon' :
                         isFull ? 'Tournament Full' : 'Register Now'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {tournaments.length === 0 && !loading && (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                background: '#FFFFFF',
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              }}
            >
              <EmojiEvents sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                No tournaments available
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Check back later for exciting tournaments to join!
              </Typography>
            </Paper>
          )}
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}