'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Skeleton,
} from '@mui/material';
import {
  EmojiEvents,
  Visibility,
  SportsEsports,
} from '@mui/icons-material';

interface UserRegistration {
  id: string;
  tournament: string;
  college: string;
  game: string;
  teamName: string;
  registeredAt: any;
  status: string;
}

export default function MyActiveTournaments() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribers: (() => void)[] = [];

    // Listen to registrations collection
    const registrationsQuery = query(
      collection(db, 'registrations'),
      where('userId', '==', user.uid)
    );

    const unsubscribeRegistrations = onSnapshot(registrationsQuery, (snapshot) => {
      const userRegistrations: UserRegistration[] = [];
      snapshot.forEach((doc) => {
        userRegistrations.push({ id: doc.id, ...doc.data() } as UserRegistration);
      });
      
      setRegistrations(userRegistrations);
      setLoading(false);
    });

    unsubscribers.push(unsubscribeRegistrations);

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [user?.uid]);

  const handleViewDetails = (registration: UserRegistration) => {
    // Navigate to tournaments page with specific registration
    window.location.href = '/dashboard/tournaments';
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 3 }}>
          My Active Tournaments
        </Typography>
        <Grid container spacing={2}>
          {[1, 2].map((item) => (
            <Grid item xs={12} sm={6} key={item}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton variant="rectangular" height={36} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: '#333',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <EmojiEvents sx={{ color: '#1976d2', fontSize: 24 }} />
        My Active Tournaments
      </Typography>

      {registrations.length === 0 ? (
        <Card
          sx={{
            borderRadius: 3,
            background: '#FFFFFF',
            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.06), -6px -6px 12px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            textAlign: 'center',
            p: 3,
          }}
        >
          <SportsEsports sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
            No active tournaments
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            Register for a tournament to see it here
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {registrations.slice(0, 4).map((registration) => (
            <Grid item xs={12} sm={6} key={registration.id}>
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
                <CardContent sx={{ p: 2.5 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={registration.game}
                      size="small"
                      sx={{
                        background: '#1976d2',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        background: '#e8f5e8',
                        color: '#2e7d32',
                        fontWeight: 600,
                        fontSize: 11,
                      }}
                    />
                  </Box>

                  {/* Tournament Info */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#333',
                      mb: 1,
                      fontSize: 14,
                    }}
                  >
                    {registration.tournament}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      mb: 2,
                      fontSize: 12,
                    }}
                  >
                    Team: {registration.teamName} • {registration.college}
                  </Typography>

                  {/* Action Button */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility sx={{ fontSize: 16 }} />}
                    onClick={() => handleViewDetails(registration)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: 12,
                      fontWeight: 500,
                      borderColor: '#1976d2',
                      color: '#1976d2',
                      py: 0.8,
                      '&:hover': {
                        borderColor: '#1565c0',
                        background: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}