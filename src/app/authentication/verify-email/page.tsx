'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { checkEmailVerification, resendVerificationEmail } from '../../../firebase/auth';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Email,
  CheckCircle,
  Refresh,
} from '@mui/icons-material';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is already verified
    if (user?.emailVerified) {
      setIsVerified(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  }, [user, router]);

  const handleCheckVerification = async () => {
    setChecking(true);
    setError('');
    setMessage('');

    try {
      const verified = await checkEmailVerification();
      if (verified) {
        setIsVerified(true);
        setMessage('Email verified successfully! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error: any) {
      setError('Failed to check verification status. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setError('Failed to send verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/authentication/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    router.push('/authentication/login');
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            background: '#FFFFFF',
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.08), -12px -12px 24px rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: 3,
                background: isVerified ? '#e8f5e8' : '#e3f2fd',
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                mb: 3,
              }}
            >
              {isVerified ? (
                <CheckCircle sx={{ fontSize: 32, color: '#2e7d32' }} />
              ) : (
                <Email sx={{ fontSize: 32, color: '#1976d2' }} />
              )}
            </Box>
            
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 1,
              }}
            >
              {isVerified ? 'Email Verified!' : 'Verify Your Email'}
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 2,
              }}
            >
              {isVerified 
                ? 'Your email has been successfully verified.'
                : `We've sent a verification email to ${user?.email}`
              }
            </Typography>

            {!isVerified && (
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                }}
              >
                Please check your inbox and click the verification link to continue.
              </Typography>
            )}
          </Box>

          {/* Success/Error Messages */}
          {message && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {message}
            </Alert>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {!isVerified && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Check Verification Button */}
              <Button
                variant="contained"
                onClick={handleCheckVerification}
                disabled={checking}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  background: '#1976d2',
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                }}
              >
                {checking ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'I\'ve Verified My Email'
                )}
              </Button>

              {/* Resend Email Button */}
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleResendEmail}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: 16,
                  fontWeight: 600,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                }}
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </Button>

              {/* Logout Button */}
              <Button
                variant="text"
                onClick={handleLogout}
                sx={{
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  color: '#666',
                }}
              >
                Use Different Account
              </Button>
            </Box>
          )}

          {isVerified && (
            <Box sx={{ mt: 3 }}>
              <CircularProgress size={24} sx={{ color: '#2e7d32' }} />
              <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                Redirecting to dashboard...
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}