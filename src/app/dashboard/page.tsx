'use client';

import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import StatsCards from '../../components/Dashboard/StatsCards';
import QuickActions from '../../components/Dashboard/QuickActions';
import EsportsProgressCard from '../../components/Dashboard/EsportsProgressCard';
import PlatformSnapshot from '../../components/Dashboard/PlatformSnapshot';
import RecentActivityFeed from '../../components/Dashboard/RecentActivityFeed';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
} from '@mui/material';

export default function Dashboard() {
  const { user, userProfile } = useAuth();

  // Get user's display name with fallback
  const getUserName = () => {
    if (userProfile?.username) return userProfile.username;
    if (user?.displayName) return user.displayName;
    return 'User';
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="lg">
          {/* Welcome Header */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 1,
              }}
            >
              Welcome back, {getUserName()}!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: 16,
              }}
            >
              Track your esports journey and tournament performance
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{ mb: 6 }}>
            <StatsCards />
          </Box>

          {/* Esports Progress & Platform Snapshot Row */}
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={8}>
              <EsportsProgressCard />
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#333',
                    mb: 2,
                  }}
                >
                  Platform Stats
                </Typography>
                <PlatformSnapshot />
              </Box>
            </Grid>
          </Grid>

          {/* Recent Activity & Quick Actions Row */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <RecentActivityFeed />
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Enhanced Quick Actions */}
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: '#FFFFFF',
                  boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.1), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                  border: '1px solid #f0f0f0',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#333',
                    mb: 2,
                  }}
                >
                  Ready to compete?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    mb: 3,
                  }}
                >
                  Join exciting tournaments and showcase your gaming skills
                </Typography>
                <QuickActions />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}