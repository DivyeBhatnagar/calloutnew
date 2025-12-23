'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Grid,
} from '@mui/material';
import {
  Support,
  Schedule,
  CheckCircle,
  Reply,
  Send,
  Refresh,
  Delete,
  Warning,
} from '@mui/icons-material';
import { getAllQueries, updateQueryStatus } from '../../firebase/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface Query {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  status: 'pending' | 'replied' | 'resolved';
  createdAt: any;
  adminReply?: string;
  repliedAt?: any;
  userId?: string;
}

export default function QueryManager() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      console.log('Admin: Fetching all queries...');
      const allQueries = await getAllQueries();
      console.log('Admin: Retrieved queries:', allQueries);
      setQueries(allQueries);
    } catch (error) {
      console.error('Error fetching queries:', error);
      setError('Failed to fetch queries. Please check your permissions.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ed6c02';
      case 'replied':
        return '#1976d2';
      case 'resolved':
        return '#2e7d32';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Schedule />;
      case 'replied':
        return <Reply />;
      case 'resolved':
        return <CheckCircle />;
      default:
        return <Support />;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewQuery = (query: Query) => {
    setSelectedQuery(query);
    setReplyText(query.adminReply || '');
    setDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleDeleteQuery = (query: Query) => {
    setQueryToDelete(query);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteQuery = async () => {
    if (!queryToDelete) return;

    setDeleting(true);
    try {
      // Try to delete from main queries collection
      if (!queryToDelete.id.includes('_')) {
        await deleteDoc(doc(db, 'queries', queryToDelete.id));
      } else {
        // Handle user subcollection deletion
        const [userId, queryId] = queryToDelete.id.split('_');
        await deleteDoc(doc(db, 'users', userId, 'queries', queryId));
      }
      
      // Update local state
      setQueries(prev => prev.filter(q => q.id !== queryToDelete.id));
      setDeleteDialogOpen(false);
      setQueryToDelete(null);
      
      console.log(`✅ Query "${queryToDelete.subject}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting query:', error);
      setError(`Failed to delete query: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuery(null);
    setReplyText('');
    setError('');
    setSuccess('');
  };

  const handleReply = async () => {
    if (!selectedQuery || !replyText.trim()) {
      setError('Please enter a reply message');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await (updateQueryStatus as any)(selectedQuery.id, 'replied', replyText.trim());
      setSuccess('Reply sent successfully!');
      
      // Update local state
      setQueries(prev => prev.map(q => 
        q.id === selectedQuery.id 
          ? { ...q, status: 'replied', adminReply: replyText.trim(), repliedAt: new Date() }
          : q
      ));
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
    } catch (error) {
      console.error('Error sending reply:', error);
      setError('Failed to send reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkResolved = async () => {
    if (!selectedQuery) return;

    setSubmitting(true);
    setError('');

    try {
      await updateQueryStatus(selectedQuery.id, 'resolved');
      setSuccess('Query marked as resolved!');
      
      // Update local state
      setQueries(prev => prev.map(q => 
        q.id === selectedQuery.id 
          ? { ...q, status: 'resolved' }
          : q
      ));
      
      // Close dialog after 2 seconds
      setTimeout(() => {
        handleCloseDialog();
      }, 2000);
    } catch (error) {
      console.error('Error marking as resolved:', error);
      setError('Failed to update status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filterQueriesByStatus = (status?: string) => {
    if (!status) return queries;
    return queries.filter(q => q.status === status);
  };

  const getTabQueries = () => {
    switch (tabValue) {
      case 0:
        return queries;
      case 1:
        return filterQueriesByStatus('pending');
      case 2:
        return filterQueriesByStatus('replied');
      case 3:
        return filterQueriesByStatus('resolved');
      default:
        return queries;
    }
  };

  const getQueryStats = () => {
    return {
      total: queries.length,
      pending: filterQueriesByStatus('pending').length,
      replied: filterQueriesByStatus('replied').length,
      resolved: filterQueriesByStatus('resolved').length,
    };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = getQueryStats();
  const tabQueries = getTabQueries();

  return (
    <Paper
      sx={{
        borderRadius: 3,
        background: '#FFFFFF',
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        border: '1px solid #f0f0f0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Query Management
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchQueries}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, background: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total Queries
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, background: '#fff3e0', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Pending
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, background: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                {stats.replied}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Replied
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', p: 2, background: '#e8f5e8', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                {stats.resolved}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Resolved
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ borderBottom: '1px solid #f0f0f0' }}
      >
        <Tab label={`All (${stats.total})`} />
        <Tab label={`Pending (${stats.pending})`} />
        <Tab label={`Replied (${stats.replied})`} />
        <Tab label={`Resolved (${stats.resolved})`} />
      </Tabs>

      {/* Queries List */}
      <Box sx={{ p: 3 }}>
        {tabQueries.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Support sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666' }}>
              No queries found
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {tabQueries.map((query) => (
              <Card
                key={query.id}
                sx={{
                  borderRadius: 2,
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {query.subject}
                        </Typography>
                        <Chip
                          icon={getStatusIcon(query.status)}
                          label={query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                          size="small"
                          sx={{
                            background: `${getStatusColor(query.status)}20`,
                            color: getStatusColor(query.status),
                            '& .MuiChip-icon': {
                              color: getStatusColor(query.status),
                            },
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        From: {query.name} ({query.email})
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#999',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {query.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        {formatDate(query.createdAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewQuery(query)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        View & Reply
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteQuery(query)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          minWidth: 'auto',
                          px: 1,
                        }}
                      >
                        <Delete fontSize="small" />
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Query Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        {selectedQuery && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Query Details
                </Typography>
                <Chip
                  icon={getStatusIcon(selectedQuery.status)}
                  label={selectedQuery.status.charAt(0).toUpperCase() + selectedQuery.status.slice(1)}
                  sx={{
                    background: `${getStatusColor(selectedQuery.status)}20`,
                    color: getStatusColor(selectedQuery.status),
                    '& .MuiChip-icon': {
                      color: getStatusColor(selectedQuery.status),
                    },
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              {/* Success/Error Messages */}
              {success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {/* User Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  User Information:
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  <strong>Name:</strong> {selectedQuery.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  <strong>Email:</strong> {selectedQuery.email}
                </Typography>
                {selectedQuery.phone && (
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    <strong>Phone:</strong> {selectedQuery.phone}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: '#666' }}>
                  <strong>Submitted:</strong> {formatDate(selectedQuery.createdAt)}
                </Typography>
              </Box>

              {/* Query Details */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Subject:
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                  {selectedQuery.subject}
                </Typography>
                
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Message:
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedQuery.message}
                  </Typography>
                </Paper>
              </Box>

              {/* Existing Reply */}
              {selectedQuery.adminReply && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                    Previous Reply:
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: '#e3f2fd',
                      border: '1px solid #1976d2',
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedQuery.adminReply}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Replied: {formatDate(selectedQuery.repliedAt)}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {/* Reply Section */}
              {selectedQuery.status !== 'resolved' && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {selectedQuery.adminReply ? 'Update Reply:' : 'Send Reply:'}
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      disabled={submitting}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={handleCloseDialog}
                disabled={submitting}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Close
              </Button>
              {selectedQuery.status !== 'resolved' && (
                <>
                  {selectedQuery.status === 'replied' && (
                    <Button
                      onClick={handleMarkResolved}
                      disabled={submitting}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        borderColor: '#2e7d32',
                        color: '#2e7d32',
                        '&:hover': {
                          borderColor: '#1b5e20',
                          background: '#e8f5e8',
                        },
                      }}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  <Button
                    onClick={handleReply}
                    disabled={submitting || !replyText.trim()}
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={16} /> : <Send />}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    {submitting ? 'Sending...' : selectedQuery.adminReply ? 'Update Reply' : 'Send Reply'}
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Query Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1, color: '#d32f2f' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Delete Query
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {queryToDelete && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  ⚠️ Warning
                </Typography>
                This action cannot be undone. The query will be permanently deleted.
              </Alert>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete this query?
              </Typography>
              
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Query Details:
                </Typography>
                <Typography variant="body2">
                  <strong>Subject:</strong> {queryToDelete.subject}
                </Typography>
                <Typography variant="body2">
                  <strong>From:</strong> {queryToDelete.name} ({queryToDelete.email})
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {queryToDelete.status}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDate(queryToDelete.createdAt)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteQuery} 
            variant="contained" 
            color="error"
            disabled={deleting}
            startIcon={<Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete Query'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}