'use client';

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, Warning } from '@mui/icons-material';
import { deleteAllUserData } from '../../utils/deleteUserRegistrations';

export default function UserDataDeleter() {
  const [email, setEmail] = useState('divyebhatnagar784@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    if (!email.trim()) {
      setResult({
        success: false,
        message: 'Please enter a valid email address'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const deleteResult = await deleteAllUserData(email.trim());
      setResult(deleteResult);
    } catch (error: any) {
      setResult({
        success: false,
        message: `Error: ${error?.message || 'Unknown error occurred'}`
      });
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(true);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          background: '#FFFFFF',
          boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
          border: '1px solid #f0f0f0',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#d32f2f' }}>
          Delete User Data
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="User Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          
          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            onClick={handleConfirmDelete}
            disabled={loading || !email.trim()}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {loading ? 'Deleting...' : 'Delete All User Data'}
          </Button>
        </Box>

        {result && (
          <Alert 
            severity={result.success ? 'success' : 'error'} 
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              {result.message}
            </Typography>
            {result.success && result.registrations && result.queries && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" display="block">
                  • Registrations deleted: {result.registrations.deletedCount}
                </Typography>
                <Typography variant="caption" display="block">
                  • Queries deleted: {result.queries.deletedCount}
                </Typography>
                <Typography variant="caption" display="block">
                  • Total items deleted: {result.totalDeleted}
                </Typography>
              </Box>
            )}
          </Alert>
        )}

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Warning:</strong> This action will permanently delete ALL registrations and queries 
            for the specified user email. This cannot be undone.
          </Typography>
        </Alert>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete ALL data for user: <strong>{email}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This will permanently delete:
            • All tournament registrations
            • All support queries
            • This action cannot be undone
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete All Data
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}