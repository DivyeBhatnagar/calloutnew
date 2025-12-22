'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Support,
  Schedule,
  CheckCircle,
  Reply,
  Add,
} from '@mui/icons-material';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { getUserQueries } from '../../../firebase/firestore';
import { useRouter } from 'next/navigation';

interface Query {
  id: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'resolved';
  createdAt: any;
  adminReply?: string;
  repliedAt?: any;
}

export default function MyQueriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUserQueries = async () => {
      if (!user?.uid) return;

      try {
        console.log('Fetching queries for user:', user.uid);
        const userQueries = await getUserQueries(user.uid);
        console.log('Retrieved user queries:', userQueries);
        setQueries(userQueries);
      } catch (error) {
        console.error('Error fetching queries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserQueries();
  }, [user]);

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
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuery(null);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <CircularProgress />
            </Box>
          </Container>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
              }}
            >
              My Queries
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/query')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.9)',
              }}
            >
              New Query
            </Button>
          </Box>

          {/* Queries List */}
          {queries.length === 0 ? (
            <Paper
              sx={{
                p: 5,
                borderRadius: 3,
                background: '#FFFFFF',
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
              }}
            >
              <Support sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#666', mb: 2 }}>
                No queries found
              </Typography>
              <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
                You haven't submitted any queries yet.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => router.push('/query')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                }}
              >
                Submit Your First Query
              </Button>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {queries.map((query) => (
                <Card
                  key={query.id}
                  sx={{
                    borderRadius: 3,
                    background: '#FFFFFF',
                    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1a1a1a',
                            mb: 1,
                          }}
                        >
                          {query.subject}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#666',
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {query.message}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#999' }}>
                          Submitted: {formatDate(query.createdAt)}
                        </Typography>
                        {query.adminReply && (
                          <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                            Replied: {formatDate(query.repliedAt)}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                        <Chip
                          icon={getStatusIcon(query.status)}
                          label={query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                          sx={{
                            background: `${getStatusColor(query.status)}20`,
                            color: getStatusColor(query.status),
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              color: getStatusColor(query.status),
                            },
                          }}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewQuery(query)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                              borderColor: '#1565c0',
                              background: '#f3f8ff',
                            },
                          }}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                    {query.adminReply && (
                      <Alert
                        severity="info"
                        sx={{
                          borderRadius: 2,
                          background: '#e3f2fd',
                          '& .MuiAlert-message': {
                            fontSize: 14,
                          },
                        }}
                      >
                        <strong>Admin Reply:</strong> {query.adminReply.substring(0, 100)}
                        {query.adminReply.length > 100 && '...'}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

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
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          color: getStatusColor(selectedQuery.status),
                        },
                      }}
                    />
                  </Box>
                </DialogTitle>
                <DialogContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Subject:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                      {selectedQuery.subject}
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Your Message:
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', mb: 2, whiteSpace: 'pre-wrap' }}>
                      {selectedQuery.message}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Submitted: {formatDate(selectedQuery.createdAt)}
                    </Typography>
                  </Box>

                  {selectedQuery.adminReply && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
                          Admin Reply:
                        </Typography>
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: '#f3f8ff',
                            border: '1px solid #e3f2fd',
                          }}
                        >
                          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            {selectedQuery.adminReply}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                            Replied: {formatDate(selectedQuery.repliedAt)}
                          </Typography>
                        </Paper>
                      </Box>
                    </>
                  )}
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                  <Button
                    onClick={handleCloseDialog}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                    }}
                  >
                    Close
                  </Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}