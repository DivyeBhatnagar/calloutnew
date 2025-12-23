'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import TournamentDetailsModal from '../../../components/Tournaments/TournamentDetailsModal';
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
  Divider,
  Badge,
} from '@mui/material';
import {
  EmojiEvents,
  People,
  CalendarToday,
  AttachMoney,
  Visibility,
  CheckCircle,
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

interface UserRegistration {
  id: string;
  tournament: string;
  college: string;
  game: string;
  username: string;
  email: string;
  userId: string;
  phoneNumber: string;
  teamName: string;
  iglName: string;
  iglContact: string;
  playerIds: string[];
  playerCount: number;
  registeredAt: any;
  status: string;
}

export default function TournamentsPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<UserRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<UserRegistration | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Real-time listener for user registrations
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribers: (() => void)[] = [];

    // Listen to registrations collection
    const registrationsQuery = query(
      collection(db, 'registrations'),
      where('userId', '==', user.uid)
    );

    const unsubscribeRegistrations = onSnapshot(registrationsQuery, (snapshot) => {
      const registrations: UserRegistration[] = [];
      snapshot.forEach((doc) => {
        registrations.push({ id: doc.id, ...doc.data() } as UserRegistration);
      });
      
      console.log('Real-time registrations update:', registrations.length);
      setUserRegistrations(registrations);
    });

    unsubscribers.push(unsubscribeRegistrations);

    // Also listen to user subcollection
    const userRegistrationsQuery = collection(db, 'users', user.uid, 'tournament_registrations');
    const unsubscribeUserRegs = onSnapshot(userRegistrationsQuery, (snapshot) => {
      const userRegs: UserRegistration[] = [];
      snapshot.forEach((doc) => {
        userRegs.push({ id: doc.id, ...doc.data() } as UserRegistration);
      });
      
      // Merge with existing registrations (avoid duplicates)
      setUserRegistrations(prev => {
        const combined = [...prev];
        userRegs.forEach(newReg => {
          if (!combined.find(existing => existing.teamName === newReg.teamName && existing.game === newReg.game)) {
            combined.push(newReg);
          }
        });
        return combined;
      });
    });

    unsubscribers.push(unsubscribeUserRegs);

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, [user?.uid]);

  // Fetch tournaments
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const tournamentsRef = collection(db, 'tournaments');
        const querySnapshot = await getDocs(tournamentsRef);
        
        const tournamentsList: Tournament[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Convert admin tournament format to display format
          tournamentsList.push({
            id: doc.id,
            name: data.name,
            game: data.games?.[0]?.name || 'Multiple Games', // Show first game or "Multiple"
            status: data.status === 'active' ? 'Open' : 
                   data.status === 'closed' ? 'Closed' : 'Upcoming',
            entryFee: 0, // Default for now
            prizePool: 50000, // Default for now
            maxParticipants: 100, // Default for now
            participants: [],
            startDate: data.createdAt || new Date().toISOString(),
            endDate: data.updatedAt || new Date().toISOString(),
          });
        });

        setTournaments(tournamentsList);
      } catch (error: any) {
        console.error('Error fetching tournaments:', error);
        setError('Failed to load tournaments. Please try again.');
        // Fallback to mock data for demo
        setTournaments([
          {
            id: '1',
            name: 'Campus Showdown 2024',
            game: 'BGMI',
            status: 'Open',
            entryFee: 0,
            prizePool: 50000,
            maxParticipants: 100,
            participants: [],
            startDate: '2024-12-25',
            endDate: '2024-12-30',
          },
          {
            id: '2',
            name: 'Free Fire MAX Championship',
            game: 'Free Fire MAX',
            status: 'Open',
            entryFee: 0,
            prizePool: 25000,
            maxParticipants: 64,
            participants: [],
            startDate: '2025-01-05',
            endDate: '2025-01-10',
          },
          {
            id: '3',
            name: 'VALORANT College Cup',
            game: 'VALORANT',
            status: 'Upcoming',
            entryFee: 0,
            prizePool: 75000,
            maxParticipants: 32,
            participants: [],
            startDate: '2025-01-15',
            endDate: '2025-01-20',
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
      case 'Registered': return { color: '#1976d2', bg: '#e3f2fd' };
      default: return { color: '#666', bg: '#f5f5f5' };
    }
  };

  const isUserRegistered = (tournamentName: string, game: string) => {
    return userRegistrations.some(reg => 
      reg.tournament === tournamentName || 
      (reg.game === game && tournamentName.includes('Campus Showdown'))
    );
  };

  const handleViewDetails = (registration: UserRegistration) => {
    setSelectedRegistration(registration);
    setModalOpen(true);
  };

  const handleRegisterClick = () => {
    window.location.href = '/dashboard/tournament-registration';
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
            Manage your registrations and discover new tournaments
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* My Registered Tournaments Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <EmojiEvents sx={{ color: '#1976d2' }} />
              My Registered Tournaments
            </Typography>

            {userRegistrations.length === 0 ? (
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: '#FFFFFF',
                  boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                  border: '1px solid #f0f0f0',
                }}
              >
                <EmojiEvents sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                  You haven't registered for any tournaments yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                  Join exciting esports tournaments and compete with the best!
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleRegisterClick}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Register for Tournament
                </Button>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {userRegistrations.map((registration) => {
                  const statusStyle = getStatusColor('Registered');
                  
                  return (
                    <Grid item xs={12} md={6} lg={4} key={registration.id}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          background: '#FFFFFF',
                          boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                          border: '2px solid #1976d2',
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
                              label={registration.game}
                              sx={{
                                background: '#1976d2',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            />
                            <Badge
                              badgeContent={<CheckCircle sx={{ fontSize: 16 }} />}
                              color="primary"
                            >
                              <Chip
                                label="Registered"
                                sx={{
                                  background: statusStyle.bg,
                                  color: statusStyle.color,
                                  fontWeight: 600,
                                  fontSize: 12,
                                }}
                              />
                            </Badge>
                          </Box>

                          {/* Tournament Name */}
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#333',
                              mb: 2,
                              lineHeight: 1.3,
                            }}
                          >
                            {registration.tournament}
                          </Typography>

                          {/* Registration Details */}
                          <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <People sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                Team: {registration.teamName}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <EmojiEvents sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                College: {registration.college}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarToday sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                              <Typography variant="body2" sx={{ color: '#666' }}>
                                Registered: {registration.registeredAt 
                                  ? new Date(registration.registeredAt.seconds * 1000).toLocaleDateString()
                                  : 'Recently'
                                }
                              </Typography>
                            </Box>
                          </Box>

                          {/* Action Button */}
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(registration)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              py: 1.5,
                              borderColor: '#1976d2',
                              color: '#1976d2',
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
                  );
                })}
              </Grid>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* All Tournaments Section */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <EmojiEvents sx={{ color: '#666' }} />
              All Tournaments
            </Typography>

            <Grid container spacing={3}>
              {tournaments.map((tournament) => {
                const statusStyle = getStatusColor(tournament.status);
                const isRegistered = isUserRegistered(tournament.name, tournament.game);
                
                return (
                  <Grid item xs={12} md={6} lg={4} key={tournament.id}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        background: '#FFFFFF',
                        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                        border: isRegistered ? '2px solid #4caf50' : '1px solid #f0f0f0',
                        transition: 'all 0.3s ease',
                        opacity: isRegistered ? 0.8 : 1,
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
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {isRegistered && (
                              <Chip
                                label="Registered"
                                icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                sx={{
                                  background: '#e8f5e8',
                                  color: '#2e7d32',
                                  fontWeight: 600,
                                  fontSize: 12,
                                }}
                              />
                            )}
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
                              Entry: {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`} • Prize: ₹{tournament.prizePool.toLocaleString()}
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
                          variant={isRegistered ? 'outlined' : (tournament.status === 'Open' ? 'contained' : 'outlined')}
                          disabled={tournament.status !== 'Open' || isRegistered}
                          onClick={isRegistered ? undefined : handleRegisterClick}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            py: 1.5,
                            boxShadow: tournament.status === 'Open' && !isRegistered
                              ? '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)'
                              : 'none',
                          }}
                        >
                          {isRegistered ? 'Already Registered' :
                           tournament.status === 'Live' ? 'Live Now' :
                           tournament.status === 'Upcoming' ? 'Coming Soon' :
                           'Register Now'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Tournament Details Modal */}
          <TournamentDetailsModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            registration={selectedRegistration}
          />
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}