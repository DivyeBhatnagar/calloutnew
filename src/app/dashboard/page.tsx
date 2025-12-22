'use client';

import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import StatsCards from '../../components/Dashboard/StatsCards';
import QuickActions from '../../components/Dashboard/QuickActions';
import {
  Container,
  Typography,
  Box,
  Paper,
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
          <Box sx={{ mb: 4 }}>
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
          <Box sx={{ mb: 4 }}>
            <StatsCards />
          </Box>

          {/* Quick Actions */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: '#FFFFFF',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
              textAlign: 'center',
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
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}