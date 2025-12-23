'use client';

import AdminRoute from '../../../components/AdminRoute';
import AdminDashboardLayout from '../../../components/Admin/AdminDashboardLayout';
import RegistrationManager from '../../../components/Admin/RegistrationManager';
import QueryManager from '../../../components/Admin/QueryManager';
import EnhancedUserManager from '../../../components/Admin/EnhancedUserManager';
import AdminStatusChecker from '../../../components/Admin/AdminStatusChecker';
import TournamentManager from '../../../components/Admin/TournamentManager';
import UserDataDeleter from '../../../components/Admin/UserDataDeleter';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab,
  Paper,
  Chip,
} from '@mui/material';
import { 
  EmojiEvents, 
  People, 
  ContactSupport, 
  AdminPanelSettings,
  TrendingUp,
  Visibility,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    tournaments: 0,
    registrations: 0,
    users: 0,
    queries: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch tournaments count
      const tournamentsRef = collection(db, 'tournaments');
      const tournamentsSnapshot = await getDocs(tournamentsRef);
      const tournamentsCount = tournamentsSnapshot.size;

      // Fetch users count
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersCount = usersSnapshot.size;

      // Fetch registrations count (approximate)
      let registrationsCount = 0;
      try {
        const registrationsRef = collection(db, 'registrations');
        const registrationsSnapshot = await getDocs(registrationsRef);
        registrationsCount = registrationsSnapshot.size;
      } catch (err) {
        console.log('Error fetching registrations count:', err);
      }

      // Fetch queries count (approximate)
      let queriesCount = 0;
      try {
        const queriesRef = collection(db, 'queries');
        const queriesSnapshot = await getDocs(queriesRef);
        queriesCount = queriesSnapshot.size;
      } catch (err) {
        console.log('Error fetching queries count:', err);
      }

      setDashboardStats({
        tournaments: tournamentsCount,
        registrations: registrationsCount,
        users: usersCount,
        queries: queriesCount,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <AdminRoute>
      <AdminDashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mb: 1,
                }}
              >
                Admin Dashboard
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#666',
                  mb: 3,
                }}
              >
                Monitor participation, manage tournaments, and oversee platform operations
              </Typography>

              {/* Quick Stats Cards */}
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
                      <EmojiEvents sx={{ fontSize: 40, mb: 2, color: '#1976d2' }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        {dashboardStats.tournaments}
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
                      <People sx={{ fontSize: 40, mb: 2, color: '#2e7d32' }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                        {dashboardStats.registrations}
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
                      <AdminPanelSettings sx={{ fontSize: 40, mb: 2, color: '#ed6c02' }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02', mb: 1 }}>
                        {dashboardStats.users}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                        Platform Users
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
                      <ContactSupport sx={{ fontSize: 40, mb: 2, color: '#7b1fa2' }} />
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2', mb: 1 }}>
                        {dashboardStats.queries}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                        Support Queries
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>

            {/* Admin Status Checker */}
            <AdminStatusChecker />

            {/* User Data Deleter */}
            <UserDataDeleter />

            {/* Management Tabs */}
            <Paper sx={{ 
              borderRadius: 3, 
              overflow: 'hidden', 
              mt: 4,
              background: '#FFFFFF',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
            }}>
              <Tabs
                value={tabValue}
                onChange={(e, newValue) => setTabValue(newValue)}
                sx={{ 
                  borderBottom: '1px solid #f0f0f0',
                  bgcolor: '#f8f9fa',
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 64,
                    color: '#666',
                    '&.Mui-selected': {
                      color: '#1976d2',
                    },
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#1976d2',
                    height: 3,
                  },
                }}
                variant="fullWidth"
              >
                <Tab 
                  label="Tournaments" 
                  icon={<EmojiEvents />}
                  iconPosition="start"
                />
                <Tab 
                  label="Registrations" 
                  icon={<People />}
                  iconPosition="start"
                />
                <Tab 
                  label="User Management" 
                  icon={<AdminPanelSettings />}
                  iconPosition="start"
                />
                <Tab 
                  label="Support Queries" 
                  icon={<ContactSupport />}
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ p: 4 }}>
                {/* Tab Content */}
                {tabValue === 0 && <TournamentManager />}
                {tabValue === 1 && <RegistrationManager />}
                {tabValue === 2 && <EnhancedUserManager />}
                {tabValue === 3 && <QueryManager />}
              </Box>
            </Paper>
          </Box>
        </Container>
      </AdminDashboardLayout>
    </AdminRoute>
  );
}