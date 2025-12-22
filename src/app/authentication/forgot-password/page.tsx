'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '../../../firebase/auth';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Email,
  SportsEsports,
} from '@mui/icons-material';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to send password reset email');
      }
    } finally {
      setLoading(false);
    }
  };

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
        <Box
          sx={{
            background: '#FFFFFF',
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.08), -12px -12px 24px rgba(255, 255, 255, 0.9)',
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
              <SportsEsports sx={{ fontSize: 32, color: '#1976d2' }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 1,
              }}
            >
              Reset Password
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
              }}
            >
              Enter your email to receive a password reset link
            </Typography>
          </Box>

          {/* Success Message */}
          {message && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {message}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Reset Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: 16,
                fontWeight: 600,
                background: '#1976d2',
                color: '#fff',
                boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  background: '#1565c0',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.12), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                },
                '&:active': {
                  boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.15), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
                },
                '&:disabled': {
                  background: '#ccc',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Reset Email'}
            </Button>
          </form>

          {/* Back to Login */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Remember your password?{' '}
              <Link href="/authentication/login" style={{ textDecoration: 'none' }}>
                <Typography
                  component="span"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Back to Login
                </Typography>
              </Link>
            </Typography>
          </Box>

          {/* Back to Home */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#999',
                  '&:hover': { color: '#666' },
                }}
              >
                ← Back to Home
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}