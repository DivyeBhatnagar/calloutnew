'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import {
  Notifications,
  Security,
  Language,
  ExitToApp,
  Delete,
} from '@mui/icons-material';

export default function SettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/authentication/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              mb: 4,
            }}
          >
            Settings
          </Typography>

          {/* Account Settings */}
          <Paper
            sx={{
              mb: 3,
              borderRadius: 3,
              background: '#FFFFFF',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive tournament updates and match reminders"
                  />
                  <ListItemSecondaryAction>
                    <Switch defaultChecked />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security to your account"
                  />
                  <ListItemSecondaryAction>
                    <Switch />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Language />
                  </ListItemIcon>
                  <ListItemText
                    primary="Language"
                    secondary="English (Default)"
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>

          {/* Account Actions */}
          <Paper
            sx={{
              borderRadius: 3,
              background: '#FFFFFF',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account Actions
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                These actions will affect your account permanently. Please proceed with caution.
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ExitToApp />}
                  onClick={handleLogout}
                  sx={{
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5,
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      borderColor: '#1565c0',
                      background: '#f3f8ff',
                    },
                  }}
                >
                  Sign Out
                </Button>
                
                <Divider sx={{ my: 1 }} />
                
                <Button
                  variant="outlined"
                  startIcon={<Delete />}
                  disabled
                  sx={{
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1.5,
                    borderColor: '#d32f2f',
                    color: '#d32f2f',
                    '&:hover': {
                      borderColor: '#c62828',
                      background: '#ffebee',
                    },
                  }}
                >
                  Delete Account (Coming Soon)
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Help Section */}
          <Paper
            sx={{
              mt: 3,
              borderRadius: 3,
              background: '#FFFFFF',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Need Help?
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                If you have any questions or need assistance, feel free to contact our support team.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Paper>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}