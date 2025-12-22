'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  SportsEsports,
} from '@mui/icons-material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signin, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signin(email, password);
      
      // Check if email is verified for password-based accounts
      if (result.user && !result.user.emailVerified && result.user.providerData[0]?.providerId === 'password') {
        router.push('/authentication/verify-email');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Attempting Google Sign-In...');
      await signInWithGoogle();
      console.log('Google Sign-In successful, redirecting...');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      
      // More specific error messages
      if (error.message.includes('popup')) {
        setError('Popup was blocked or closed. Please allow popups and try again.');
      } else if (error.message.includes('unauthorized-domain')) {
        setError('This domain is not authorized for Google Sign-In. Please contact support.');
      } else if (error.message.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(`Google Sign-In failed: ${error.message || 'Unknown error'}`);
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
              Login
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
              }}
            >
              Welcome back to CALLOUT ESPORTS
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
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

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#1976d2' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
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

            <Box sx={{ textAlign: 'right', mb: 3 }}>
              <Link href="/authentication/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1976d2',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Forgot password?
                </Typography>
              </Link>
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: '#999' }}>
              OR
            </Typography>
          </Divider>

          {/* Google Sign In */}
          <Button
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={<Google />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: 16,
              fontWeight: 600,
              background: '#FFFFFF',
              color: '#333',
              border: '2px solid #1976d2',
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px rgba(255, 255, 255, 0.9)',
              '&:hover': {
                background: '#f5f5f5',
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
              },
              '&:active': {
                boxShadow: 'inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            Login with Google
          </Button>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link href="/authentication/register" style={{ textDecoration: 'none' }}>
                <Typography
                  component="span"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Sign up
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