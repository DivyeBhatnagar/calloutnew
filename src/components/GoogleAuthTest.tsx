'use client';

import { useState } from 'react';
import { Button, Alert, Box, Typography } from '@mui/material';
import { signInWithGoogle } from '../firebase/auth';

export default function GoogleAuthTest() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const testGoogleAuth = async () => {
    setLoading(true);
    setResult('');
    setError('');

    try {
      console.log('=== Google Auth Test Started ===');
      
      // Test Firebase config
      console.log('Environment variables:', {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
      });

      const authResult = await signInWithGoogle();
      console.log('=== Google Auth Success ===', authResult.user.email);
      
      setResult(`Success! Signed in as: ${authResult.user.email}`);
    } catch (error: any) {
      console.error('=== Google Auth Error ===', error);
      setError(`Error: ${error.code || 'Unknown'} - ${error.message || 'No message'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ddd', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Google Auth Test Component
      </Typography>
      
      <Button
        variant="contained"
        onClick={testGoogleAuth}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Google Sign-In'}
      </Button>

      {result && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {result}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        Check browser console for detailed logs
      </Typography>
    </Box>
  );
}