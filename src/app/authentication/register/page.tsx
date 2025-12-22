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
  Person,
  Google,
  SportsEsports,
} from '@mui/icons-material';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.username);
      // Redirect to email verification instead of dashboard
      router.push('/authentication/verify-email');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (error: any) {
      setError('Failed to sign up with Google');
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
              Create Account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#666',
              }}
            >
              Join the esports community today
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                value={formData.username}
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
            </Box>

            <Box sx={{ mb: 3 }}>
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
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={formData.password}
                onChange={handleChange}
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

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: '#999' }}>
              OR
            </Typography>
          </Divider>

          {/* Google Sign Up */}
          <Button
            fullWidth
            onClick={handleGoogleSignUp}
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
            Sign up with Google
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Already have an account?{' '}
              <Link href="/authentication/login" style={{ textDecoration: 'none' }}>
                <Typography
                  component="span"
                  sx={{
                    color: '#1976d2',
                    fontWeight: 600,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Login
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