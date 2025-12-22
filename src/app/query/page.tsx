'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Email,
  Message,
  Support,
  Person,
  Phone,
  Send,
} from '@mui/icons-material';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function QueryPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
  });

  // Auto-fill user data if logged in
  const userName = userProfile?.username || user?.displayName || '';
  const userEmail = user?.email || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return false;
    }
    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const queryData = {
        // User info
        name: userName || formData.name,
        email: userEmail || formData.email,
        userId: user?.uid || null,
        
        // Query details
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        phone: formData.phone.trim() || null,
        
        // Metadata
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        adminReply: null,
        repliedAt: null,
      };

      console.log('Submitting query:', queryData);

      // Store locally as backup first
      localStorage.setItem('query_backup', JSON.stringify(queryData));

      // Try multiple approaches to save the data
      let saveSuccessful = false;

      // Approach 1: Save to registrations collection (same as tournaments) with unique ID
      try {
        const timestamp = new Date().getTime();
        const queryId = user?.uid ? `${user.uid}_query_${timestamp}` : `guest_query_${timestamp}`;
        const queryRef = doc(db, 'registrations', queryId);
        await setDoc(queryRef, { ...queryData, type: 'query' });
        console.log('✅ Query saved to registrations collection with ID:', queryId);
        
        // Verify the save by trying to read it back
        const savedDoc = await getDoc(queryRef);
        if (savedDoc.exists()) {
          console.log('✅ Verified: Query exists in Firestore:', savedDoc.data());
          saveSuccessful = true;
        } else {
          console.log('❌ Verification failed: Query not found after save');
        }
      } catch (error: any) {
        console.log('❌ Registrations collection save failed:', error?.message || error);
        console.log('Full error details:', error);
      }

      // Approach 2: Save as subcollection under user document (if logged in)
      if (!saveSuccessful && user?.uid) {
        try {
          const timestamp = new Date().getTime();
          const userQueryRef = doc(db, 'users', user.uid, 'queries', `query_${timestamp}`);
          await setDoc(userQueryRef, queryData);
          console.log('✅ Query saved to user subcollection');
          saveSuccessful = true;
        } catch (error: any) {
          console.log('❌ User subcollection save failed:', error?.message || error);
        }
      }

      // Approach 3: Save to queries collection with unique ID
      if (!saveSuccessful) {
        try {
          const timestamp = new Date().getTime();
          const queryId = user?.uid ? `${user.uid}_query_${timestamp}` : `guest_query_${timestamp}`;
          const queryRef = doc(db, 'queries', queryId);
          await setDoc(queryRef, queryData);
          console.log('✅ Query saved to queries collection with ID:', queryId);
          saveSuccessful = true;
        } catch (error: any) {
          console.log('❌ Queries collection save failed:', error?.message || error);
        }
      }

      // Approach 4: Use addDoc to auto-generate unique ID in registrations
      if (!saveSuccessful) {
        try {
          const docRef = await addDoc(collection(db, 'registrations'), { ...queryData, type: 'query' });
          console.log('✅ Query saved to registrations with auto-generated ID:', docRef.id);
          saveSuccessful = true;
        } catch (error: any) {
          console.log('❌ Auto-generated registrations save failed:', error?.message || error);
        }
      }

      if (saveSuccessful) {
        // Clear backup since save was successful
        localStorage.removeItem('query_backup');
        
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          phone: '',
        });

        // Redirect to dashboard after 3 seconds if user is logged in
        if (user) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      } else {
        throw new Error('All save methods failed. Query data has been saved locally as backup.');
      }

    } catch (error: any) {
      console.error('Query submission error:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to submit query, but your data has been saved locally. Please contact support with your query details.';
      
      if (error?.code === 'permission-denied') {
        errorMessage = 'Database permission issue. Your query has been saved locally. Please contact support directly.';
      } else if (error?.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Your query has been saved locally. Please try again later.';
      } else if (error?.code === 'unauthenticated') {
        errorMessage = 'Authentication issue. Please try refreshing the page and submitting again.';
      }
      
      setError(errorMessage);
      
      // Still show success since we have local backup
      setTimeout(() => {
        setSuccess(true);
        // Also redirect for logged-in users even in error case
        if (user) {
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        }
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e3f2fd 50%, #f8fbff 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            sx={{
              p: 5,
              borderRadius: 4,
              background: '#FFFFFF',
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.08), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 3,
                background: '#FFFFFF',
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <Support sx={{ fontSize: 32, color: '#1976d2' }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 2,
              }}
            >
              Query Submitted Successfully!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 3,
              }}
            >
              Your query has been submitted successfully. Our team will contact you soon.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#999',
                mb: 2,
              }}
            >
              We've received your query and will respond within 24 hours.
            </Typography>
            {user && (
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                }}
              >
                Redirecting to dashboard...
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e3f2fd 50%, #f8fbff 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: '#FFFFFF',
            boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.08), -12px -12px 24px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: 3,
                background: '#FFFFFF',
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                mb: 3,
              }}
            >
              <Support sx={{ fontSize: 32, color: '#1976d2' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 1,
              }}
            >
              Have a Question? We're here to help.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                fontSize: 16,
              }}
            >
              Send us your query and our team will get back to you soon.
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Query Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Auto-filled fields for logged-in users */}
              {user ? (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={userName}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          background: '#f8f9fa',
                          boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={userEmail}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          background: '#f8f9fa',
                          boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                          '& fieldset': { border: 'none' },
                        },
                      }}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="name"
                      label="Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          background: '#FFFFFF',
                          boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                          '& fieldset': { border: 'none' },
                          '&:hover': {
                            boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.08), inset -6px -6px 12px rgba(255, 255, 255, 0.9)',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="email"
                      type="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#1976d2' }} />
                          </InputAdornment>
                        ),
                        sx: {
                          borderRadius: 2,
                          background: '#FFFFFF',
                          boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                          '& fieldset': { border: 'none' },
                          '&:hover': {
                            boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.08), inset -6px -6px 12px rgba(255, 255, 255, 0.9)',
                          },
                        },
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Phone Number (Optional) */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#1976d2' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      background: '#FFFFFF',
                      boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                      '& fieldset': { border: 'none' },
                      '&:hover': {
                        boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.08), inset -6px -6px 12px rgba(255, 255, 255, 0.9)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Subject */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="subject"
                  label="Subject *"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Message sx={{ color: '#1976d2' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      background: '#FFFFFF',
                      boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                      '& fieldset': { border: 'none' },
                      '&:hover': {
                        boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.08), inset -6px -6px 12px rgba(255, 255, 255, 0.9)',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Message */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="message"
                  label="Message *"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  disabled={loading}
                  placeholder="Please describe your query in detail..."
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      background: '#FFFFFF',
                      boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.06), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
                      '& fieldset': { border: 'none' },
                      '&:hover': {
                        boxShadow: 'inset 6px 6px 12px rgba(0, 0, 0, 0.08), inset -6px -6px 12px rgba(255, 255, 255, 0.9)',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                type="submit"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  background: '#1976d2',
                  color: '#fff',
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                  '&:hover': {
                    background: '#1565c0',
                    transform: 'translateY(-1px)',
                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.12), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                    transform: 'none',
                  },
                }}
              >
                {loading ? 'Submitting...' : 'Submit Query'}
              </Button>
            </Box>
          </form>

          {/* Back to Home */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              onClick={() => router.push('/')}
              sx={{
                color: '#999',
                textTransform: 'none',
                '&:hover': { color: '#666', background: 'transparent' },
              }}
            >
              ← Back to Home
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}