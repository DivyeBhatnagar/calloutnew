'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { updateUser } from '../../../firebase/firestore';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  Skeleton,
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    phoneNumber: '',
    bio: '',
    favoriteGame: '',
    discordId: '',
    currentRank: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || '',
        email: userProfile.email || user?.email || '',
        displayName: userProfile.displayName || user?.displayName || '',
        phoneNumber: userProfile.phoneNumber || '',
        bio: userProfile.bio || '',
        favoriteGame: userProfile.favoriteGame || '',
        discordId: userProfile.discordId || '',
        currentRank: userProfile.stats?.currentRank || 'Bronze',
      });
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    if (!user?.uid) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateUser(user.uid, {
        username: formData.username,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        bio: formData.bio,
        favoriteGame: formData.favoriteGame,
        discordId: formData.discordId,
        // Note: currentRank is not included as it's auto-calculated
        updatedAt: new Date().toISOString(),
      });

      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: userProfile?.username || '',
      email: userProfile?.email || user?.email || '',
      displayName: userProfile?.displayName || user?.displayName || '',
      phoneNumber: userProfile?.phoneNumber || '',
      bio: userProfile?.bio || '',
      favoriteGame: userProfile?.favoriteGame || '',
      discordId: userProfile?.discordId || '',
      currentRank: userProfile?.stats?.currentRank || 'Bronze',
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (!userProfile) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Container maxWidth="md">
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 2 }} />
              <Skeleton variant="text" height={40} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={200} />
            </Paper>
          </Container>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

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
            Profile Settings
          </Typography>

          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              background: '#FFFFFF',
              boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
              border: '1px solid #f0f0f0',
            }}
          >
            {/* Profile Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar
                src={user?.photoURL || '/default-avatar.svg'}
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
                {userProfile.username || user?.displayName || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {userProfile.role || 'Gamer'}
              </Typography>
            </Box>

            {/* Success/Error Messages */}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Profile Form */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!editing || loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: editing ? '#FFFFFF' : '#f9f9f9',
                      boxShadow: editing
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.06), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                        : 'none',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  disabled
                  helperText="Email cannot be changed"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: '#f9f9f9',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!editing || loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: editing ? '#FFFFFF' : '#f9f9f9',
                      boxShadow: editing
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.06), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                        : 'none',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  disabled={!editing || loading}
                  placeholder="1234567890"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: editing ? '#FFFFFF' : '#f9f9f9',
                      boxShadow: editing
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.06), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                        : 'none',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Favorite Game"
                  value={formData.favoriteGame}
                  onChange={(e) => setFormData({ ...formData, favoriteGame: e.target.value })}
                  disabled={!editing || loading}
                  placeholder="BGMI, Free Fire MAX, etc."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: editing ? '#FFFFFF' : '#f9f9f9',
                      boxShadow: editing
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.06), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                        : 'none',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Rank"
                  value={formData.currentRank}
                  disabled
                  helperText="Rank is automatically calculated based on tournament performance"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: '#f9f9f9',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Discord ID"
                  value={formData.discordId}
                  onChange={(e) => setFormData({ ...formData, discordId: e.target.value })}
                  disabled={!editing || loading}
                  placeholder="username#1234"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: editing ? '#FFFFFF' : '#f9f9f9',
                      boxShadow: editing
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.06), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                        : 'none',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!editing || loading}
                  multiline
                  rows={3}
                  placeholder="Tell us about yourself..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      background: editing ? '#FFFFFF' : '#f9f9f9',
                      boxShadow: editing
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.06), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
                        : 'none',
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {!editing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setEditing(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 3,
                      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}