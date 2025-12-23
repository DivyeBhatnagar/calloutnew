'use client';

import { useAuth } from '../../contexts/AuthContext';
import { Box, Paper, Typography, Chip, Alert } from '@mui/material';

/**
 * AdminStatusChecker Component
 * 
 * A simple component to display current user's admin status
 * Useful for debugging and verification
 */
export default function AdminStatusChecker() {
  const { user, userProfile, isAdmin } = useAuth();

  if (!user) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Alert severity="warning">
          No user logged in
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Admin Status Check
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            <strong>Email:</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {user.email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            <strong>Role:</strong>
          </Typography>
          <Chip 
            label={userProfile?.role || 'Loading...'} 
            color={userProfile?.role === 'admin' ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            <strong>Admin Access:</strong>
          </Typography>
          <Chip 
            label={isAdmin() ? 'GRANTED' : 'DENIED'} 
            color={isAdmin() ? 'success' : 'error'}
            size="small"
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ minWidth: 100 }}>
            <strong>User ID:</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
            {user.uid}
          </Typography>
        </Box>

        {userProfile?.promotedToAdminAt && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ minWidth: 100 }}>
              <strong>Promoted:</strong>
            </Typography>
            <Typography variant="body2">
              {new Date(userProfile.promotedToAdminAt).toLocaleString()}
            </Typography>
          </Box>
        )}
      </Box>

      {isAdmin() ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          ✅ You have admin privileges and can access all admin features.
        </Alert>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          ℹ️ You are logged in as a regular user. Admin features are not accessible.
        </Alert>
      )}
    </Paper>
  );
}