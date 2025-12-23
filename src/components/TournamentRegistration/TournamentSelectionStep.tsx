'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Skeleton,
  Alert,
  Chip,
} from '@mui/material';
import {
  EmojiEvents,
  People,
  SportsEsports,
  ArrowBack,
} from '@mui/icons-material';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface Tournament {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  status: 'draft' | 'active' | 'closed';
  maxSlots?: number;
  currentRegistrations?: number;
  colleges: Array<{
    id: string;
    name: string;
    logoUrl: string;
  }>;
  games: Array<{
    id: string;
    name: string;
    logoUrl: string;
  }>;
}

interface TournamentSelectionStepProps {
  onSelect: (tournament: Tournament) => void;
  onBack?: () => void;
  selectedTournament?: Tournament | null;
}

export default function TournamentSelectionStep({ 
  onSelect, 
  onBack, 
  selectedTournament 
}: TournamentSelectionStepProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveTournaments();
  }, []);

  const fetchActiveTournaments = async () => {
    try {
      setLoading(true);
      const tournamentsRef = collection(db, 'tournaments');
      const q = query(tournamentsRef, where('status', '==', 'active'));
      const querySnapshot = await getDocs(q);
      
      const tournamentsList: Tournament[] = [];
      
      for (const doc of querySnapshot.docs) {
        const tournamentData = { id: doc.id, ...doc.data() } as Tournament;
        
        // Count registrations for this tournament
        let registrationCount = 0;
        try {
          // Count from main registrations collection
          const registrationsRef = collection(db, 'registrations');
          const registrationsSnapshot = await getDocs(registrationsRef);
          
          registrationsSnapshot.forEach((regDoc) => {
            const regData = regDoc.data();
            if (regData.tournament === tournamentData.name && !regData.queryType) {
              registrationCount++;
            }
          });
          
          // Also count from user subcollections
          const usersRef = collection(db, 'users');
          const usersSnapshot = await getDocs(usersRef);
          
          for (const userDoc of usersSnapshot.docs) {
            try {
              const userRegistrationsRef = collection(db, 'users', userDoc.id, 'tournament_registrations');
              const userRegSnapshot = await getDocs(userRegistrationsRef);
              
              userRegSnapshot.forEach((regDoc) => {
                const regData = regDoc.data();
                if (regData.tournament === tournamentData.name && !regData.queryType) {
                  registrationCount++;
                }
              });
            } catch (err) {
              console.log(`Error counting registrations for user ${userDoc.id}:`, err);
            }
          }
        } catch (err) {
          console.log('Error counting registrations:', err);
        }
        
        tournamentData.currentRegistrations = registrationCount;
        
        // Only include tournaments that are not full
        if (registrationCount < (tournamentData.maxSlots || 50)) {
          tournamentsList.push(tournamentData);
        }
      }

      setTournaments(tournamentsList);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, textAlign: 'center' }}>
          Select Tournament
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
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchActiveTournaments}>
          Retry
        </Button>
      </Box>
    );
  }

  if (tournaments.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <EmojiEvents sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#666' }}>
          No Active Tournaments
        </Typography>
        <Typography variant="body1" sx={{ color: '#999', mb: 3 }}>
          There are currently no tournaments available for registration.
        </Typography>
        {onBack && (
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ borderRadius: 2 }}
          >
            Go Back
          </Button>
        )}
      </Box>
    );
  }

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
          Select Tournament
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            fontWeight: 400,
          }}
        >
          Choose from our active esports tournaments
        </Typography>
      </Box>

      {/* Back Button */}
      {onBack && (
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
            Back
          </Button>
        </Box>
      )}

      {/* Tournaments Grid */}
      <Grid container spacing={4}>
        {tournaments.map((tournament) => (
          <Grid item xs={12} md={6} lg={4} key={tournament.id}>
            <Card
              sx={{
                borderRadius: 3,
                background: '#FFFFFF',
                boxShadow: selectedTournament?.id === tournament.id
                  ? '12px 12px 24px rgba(25, 118, 210, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
                  : '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                border: selectedTournament?.id === tournament.id
                  ? '2px solid #1976d2'
                  : '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => onSelect(tournament)}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                {/* Tournament Logo */}
                {tournament.logoUrl && (
                  <Box sx={{ mb: 3 }}>
                    <img
                      src={tournament.logoUrl}
                      alt={tournament.name}
                      style={{
                        width: 80,
                        height: 80,
                        objectFit: 'contain',
                        borderRadius: 12,
                      }}
                    />
                  </Box>
                )}

                {/* Tournament Name */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: '#1a1a1a',
                    mb: 2,
                    lineHeight: 1.3,
                  }}
                >
                  {tournament.name}
                </Typography>

                {/* Description */}
                {tournament.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#666',
                      mb: 3,
                      lineHeight: 1.5,
                    }}
                  >
                    {tournament.description}
                  </Typography>
                )}

                {/* Tournament Stats */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                  <Chip
                    icon={<EmojiEvents />}
                    label={`${tournament.colleges.length} Colleges`}
                    sx={{
                      background: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<SportsEsports />}
                    label={`${tournament.games.length} Games`}
                    sx={{
                      background: '#e8f5e8',
                      color: '#2e7d32',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Slots Information */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Available Slots: {(tournament.maxSlots || 50) - (tournament.currentRegistrations || 0)} / {tournament.maxSlots || 50}
                  </Typography>
                  <Box sx={{ width: '100%', bgcolor: '#f0f0f0', borderRadius: 1, height: 6 }}>
                    <Box
                      sx={{
                        width: `${Math.min(((tournament.currentRegistrations || 0) / (tournament.maxSlots || 50)) * 100, 100)}%`,
                        bgcolor: (tournament.currentRegistrations || 0) >= (tournament.maxSlots || 50) * 0.8 
                          ? '#ed6c02' 
                          : '#1976d2',
                        height: '100%',
                        borderRadius: 1,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant={selectedTournament?.id === tournament.id ? 'contained' : 'outlined'}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    fontSize: 16,
                    boxShadow: selectedTournament?.id === tournament.id
                      ? '4px 4px 8px rgba(25, 118, 210, 0.2)'
                      : 'none',
                  }}
                >
                  {selectedTournament?.id === tournament.id ? 'Selected' : 'Select Tournament'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}