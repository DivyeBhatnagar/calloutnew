'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  People,
  EmojiEvents,
  School,
  SportsEsports,
  CalendarToday,
  Analytics,
} from '@mui/icons-material';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface AnalyticsData {
  totalRegistrations: number;
  totalUsers: number;
  totalTournaments: number;
  activeUsers: number;
  registrationsByTournament: { [key: string]: number };
  registrationsByGame: { [key: string]: number };
  registrationsByCollege: { [key: string]: number };
  registrationTrend: { date: string; count: number }[];
  topColleges: { name: string; count: number; percentage: number }[];
  topGames: { name: string; count: number; percentage: number }[];
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch all registrations
      const allRegistrations: any[] = [];
      
      // From main registrations collection
      try {
        const registrationsRef = collection(db, 'registrations');
        const registrationsSnapshot = await getDocs(registrationsRef);
        registrationsSnapshot.forEach((doc) => {
          allRegistrations.push({ id: doc.id, ...doc.data() });
        });
      } catch (err) {
        console.log('Error fetching from registrations collection:', err);
      }

      // From user subcollections
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        for (const userDoc of usersSnapshot.docs) {
          try {
            const userRegistrationsRef = collection(db, 'users', userDoc.id, 'tournament_registrations');
            const userRegSnapshot = await getDocs(userRegistrationsRef);
            
            userRegSnapshot.forEach((regDoc) => {
              const existingReg = allRegistrations.find(r => 
                r.userId === userDoc.id && 
                r.teamName === regDoc.data().teamName &&
                r.game === regDoc.data().game
              );
              
              if (!existingReg) {
                allRegistrations.push({ 
                  id: `${userDoc.id}_${regDoc.id}`, 
                  ...regDoc.data() 
                });
              }
            });
          } catch (userErr) {
            console.log(`Error fetching registrations for user ${userDoc.id}:`, userErr);
          }
        }
      } catch (err) {
        console.log('Error fetching from user subcollections:', err);
      }

      // Fetch tournaments
      const tournamentsRef = collection(db, 'tournaments');
      const tournamentsSnapshot = await getDocs(tournamentsRef);
      const totalTournaments = tournamentsSnapshot.size;

      // Fetch users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const totalUsers = usersSnapshot.size;

      // Process analytics
      const registrationsByTournament: { [key: string]: number } = {};
      const registrationsByGame: { [key: string]: number } = {};
      const registrationsByCollege: { [key: string]: number } = {};
      const registrationTrend: { [key: string]: number } = {};

      allRegistrations.forEach((reg) => {
        // By tournament
        const tournament = reg.tournament || 'Campus Showdown';
        registrationsByTournament[tournament] = (registrationsByTournament[tournament] || 0) + 1;

        // By game
        if (reg.game) {
          registrationsByGame[reg.game] = (registrationsByGame[reg.game] || 0) + 1;
        }

        // By college
        if (reg.college) {
          registrationsByCollege[reg.college] = (registrationsByCollege[reg.college] || 0) + 1;
        }

        // By date (for trend)
        if (reg.registeredAt) {
          const date = new Date(reg.registeredAt.seconds * 1000).toISOString().split('T')[0];
          registrationTrend[date] = (registrationTrend[date] || 0) + 1;
        }
      });

      // Calculate top colleges and games
      const topColleges = Object.entries(registrationsByCollege)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / allRegistrations.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const topGames = Object.entries(registrationsByGame)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / allRegistrations.length) * 100)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Convert trend data
      const trendData = Object.entries(registrationTrend)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30); // Last 30 days

      // Calculate active users (users with registrations)
      const activeUserIds = new Set(allRegistrations.map(reg => reg.userId).filter(Boolean));
      const activeUsers = activeUserIds.size;

      setAnalytics({
        totalRegistrations: allRegistrations.length,
        totalUsers,
        totalTournaments,
        activeUsers,
        registrationsByTournament,
        registrationsByGame,
        registrationsByCollege,
        registrationTrend: trendData,
        topColleges,
        topGames,
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(`Failed to fetch analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Analytics Dashboard
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={40} />
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
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Analytics Dashboard
        </Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!analytics) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Analytics Dashboard
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <People sx={{ fontSize: 40, mb: 2, color: '#1976d2' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {analytics.totalRegistrations}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Total Registrations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <TrendingUp sx={{ fontSize: 40, mb: 2, color: '#2e7d32' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {analytics.activeUsers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Active Users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <EmojiEvents sx={{ fontSize: 40, mb: 2, color: '#ed6c02' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02', mb: 1 }}>
                {analytics.totalTournaments}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Active Tournaments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Analytics sx={{ fontSize: 40, mb: 2, color: '#7b1fa2' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2', mb: 1 }}>
                {Math.round((analytics.activeUsers / analytics.totalUsers) * 100)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Engagement Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Colleges and Games */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top Participating Colleges
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>College</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Registrations</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Share</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.topColleges.slice(0, 8).map((college, index) => (
                    <TableRow key={college.name}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            sx={{ 
                              mr: 1, 
                              minWidth: 24,
                              bgcolor: index < 3 ? '#1976d2' : '#f5f5f5',
                              color: index < 3 ? 'white' : '#666'
                            }} 
                          />
                          {college.name}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {college.count}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={college.percentage}
                            sx={{ 
                              flexGrow: 1, 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: '#f5f5f5',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: '#1976d2'
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {college.percentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SportsEsports sx={{ mr: 1, color: '#2e7d32' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Most Popular Games
              </Typography>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Game</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Registrations</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Share</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.topGames.slice(0, 8).map((game, index) => (
                    <TableRow key={game.name}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={index + 1} 
                            size="small" 
                            sx={{ 
                              mr: 1, 
                              minWidth: 24,
                              bgcolor: index < 3 ? '#2e7d32' : '#f5f5f5',
                              color: index < 3 ? 'white' : '#666'
                            }} 
                          />
                          {game.name}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {game.count}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={game.percentage}
                            sx={{ 
                              flexGrow: 1, 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: '#f5f5f5',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: '#2e7d32'
                              }
                            }}
                          />
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {game.percentage}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Tournament Breakdown */}
      <Paper sx={{ 
        p: 3, 
        borderRadius: 3,
        background: '#FFFFFF',
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        border: '1px solid #f0f0f0',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmojiEvents sx={{ mr: 1, color: '#ed6c02' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Tournament Participation Breakdown
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {Object.entries(analytics.registrationsByTournament).map(([tournament, count]) => (
            <Grid item xs={12} sm={6} md={4} key={tournament}>
              <Card sx={{ 
                p: 2, 
                borderRadius: 2,
                background: '#FFFFFF',
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.08), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.12), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-1px)',
                },
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {tournament}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                  {count}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  registrations
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}