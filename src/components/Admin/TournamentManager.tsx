'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  EmojiEvents,
  People,
  CalendarToday,
  Delete,
  Timeline,
} from '@mui/icons-material';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import TournamentForm from './TournamentForm';
import { LinearProgress } from '@mui/material';

interface Tournament {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  status: 'draft' | 'active' | 'closed';
  maxSlots: number;
  currentRegistrations?: number;
  createdAt: string;
  updatedAt: string;
  colleges: Array<{
    id: string;
    name: string;
    logoUrl: string;
  }>;
  games: Array<{
    id: string;
    name: string;
    logoUrl: string;
  }>;
}

export default function TournamentManager() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingTournament, setViewingTournament] = useState<Tournament | null>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const tournamentsRef = collection(db, 'tournaments');
      const querySnapshot = await getDocs(tournamentsRef);
      
      const tournamentsList: Tournament[] = [];
      
      for (const doc of querySnapshot.docs) {
        const tournamentData = { id: doc.id, ...doc.data() } as Tournament;
        
        // Count registrations for this tournament
        let registrationCount = 0;
        try {
          // Count from main registrations collection
          const registrationsRef = collection(db, 'registrations');
          const registrationsSnapshot = await getDocs(registrationsRef);
          
          registrationsSnapshot.forEach((regDoc) => {
            const regData = regDoc.data();
            if (regData.tournament === tournamentData.name && !regData.queryType) {
              registrationCount++;
            }
          });
          
          // Also count from user subcollections
          const usersRef = collection(db, 'users');
          const usersSnapshot = await getDocs(usersRef);
          
          for (const userDoc of usersSnapshot.docs) {
            try {
              const userRegistrationsRef = collection(db, 'users', userDoc.id, 'tournament_registrations');
              const userRegSnapshot = await getDocs(userRegistrationsRef);
              
              userRegSnapshot.forEach((regDoc) => {
                const regData = regDoc.data();
                if (regData.tournament === tournamentData.name && !regData.queryType) {
                  registrationCount++;
                }
              });
            } catch (err) {
              console.log(`Error counting registrations for user ${userDoc.id}:`, err);
            }
          }
        } catch (err) {
          console.log('Error counting registrations:', err);
        }
        
        tournamentData.currentRegistrations = registrationCount;
        tournamentsList.push(tournamentData);
      }

      // Sort by creation date (newest first)
      tournamentsList.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setTournaments(tournamentsList);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setError('Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingTournament(null);
    setFormOpen(true);
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setFormOpen(true);
  };

  const handleView = (tournament: Tournament) => {
    setViewingTournament(tournament);
    setViewDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!tournamentToDelete) return;

    try {
      setDeleting(true);
      await deleteDoc(doc(db, 'tournaments', tournamentToDelete.id));
      
      setTournaments(prev => prev.filter(t => t.id !== tournamentToDelete.id));
      setDeleteDialogOpen(false);
      setTournamentToDelete(null);
      
      console.log(`✅ Tournament "${tournamentToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting tournament:', error);
      setError('Failed to delete tournament');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingTournament(null);
    fetchTournaments(); // Refresh the list
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { color: '#2e7d32', bg: '#e8f5e8' };
      case 'draft':
        return { color: '#ed6c02', bg: '#fff3e0' };
      case 'closed':
        return { color: '#666', bg: '#f5f5f5' };
      default:
        return { color: '#666', bg: '#f5f5f5' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Tournament Management
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={100} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Tournament Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
          }}
        >
          Create New Tournament
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {tournaments.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
          }}
        >
          <EmojiEvents sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
            No tournaments created yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', mb: 3 }}>
            Create your first tournament to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateNew}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
            }}
          >
            Create Tournament
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {tournaments.map((tournament) => {
            const statusStyle = getStatusColor(tournament.status);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={tournament.id}>
                <Card
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
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip
                        label={tournament.status.toUpperCase()}
                        sx={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 600,
                          fontSize: 12,
                        }}
                      />
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(tournament)}
                          sx={{ color: '#1976d2' }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setTournamentToDelete(tournament);
                            setDeleteDialogOpen(true);
                          }}
                          sx={{ color: '#d32f2f' }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Tournament Logo */}
                    {tournament.logoUrl && (
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <img
                          src={tournament.logoUrl}
                          alt={tournament.name}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'contain',
                            borderRadius: 8,
                          }}
                        />
                      </Box>
                    )}

                    {/* Tournament Name */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        mb: 2,
                        lineHeight: 1.3,
                        textAlign: 'center',
                      }}
                    >
                      {tournament.name}
                    </Typography>

                    {/* Tournament Details */}
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EmojiEvents sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {tournament.colleges?.length || 0} Colleges
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <People sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          {tournament.games?.length || 0} Games
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarToday sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          Created: {formatDate(tournament.createdAt)}
                        </Typography>
                      </Box>
                      
                      {/* Registration Progress */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>
                            Registrations
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                            {tournament.currentRegistrations || 0} / {tournament.maxSlots}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(((tournament.currentRegistrations || 0) / tournament.maxSlots) * 100, 100)}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: (tournament.currentRegistrations || 0) >= tournament.maxSlots 
                                ? '#d32f2f' 
                                : (tournament.currentRegistrations || 0) >= tournament.maxSlots * 0.8 
                                  ? '#ed6c02' 
                                  : '#1976d2',
                              borderRadius: 4,
                            },
                          }}
                        />
                        {(tournament.currentRegistrations || 0) >= tournament.maxSlots && (
                          <Typography variant="caption" sx={{ color: '#d32f2f', fontWeight: 600, mt: 0.5, display: 'block' }}>
                            Tournament Full
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(tournament)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1,
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Visibility />}
                        onClick={() => handleView(tournament)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1,
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Tournament Form Dialog */}
      <TournamentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTournament(null);
        }}
        tournament={editingTournament}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Tournament</DialogTitle>
        <DialogContent>
          {tournamentToDelete && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete this tournament?
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Tournament: {tournamentToDelete.name}
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action cannot be undone. All associated registrations will also be affected.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Tournament'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tournament View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Timeline sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Tournament Details & Progress
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {viewingTournament && (
            <Box sx={{ pt: 1 }}>
              {/* Tournament Info */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, textAlign: 'center' }}>
                  {viewingTournament.name}
                </Typography>
                
                {/* Registration Progress */}
                <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
                    Registration Progress
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Current Registrations
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 700 }}>
                        {viewingTournament.currentRegistrations || 0} / {viewingTournament.maxSlots}
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(((viewingTournament.currentRegistrations || 0) / viewingTournament.maxSlots) * 100, 100)}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: (viewingTournament.currentRegistrations || 0) >= viewingTournament.maxSlots 
                            ? '#d32f2f' 
                            : (viewingTournament.currentRegistrations || 0) >= viewingTournament.maxSlots * 0.8 
                              ? '#ed6c02' 
                              : '#1976d2',
                          borderRadius: 6,
                        },
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        0%
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 600 }}>
                        {Math.round(((viewingTournament.currentRegistrations || 0) / viewingTournament.maxSlots) * 100)}% Full
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        100%
                      </Typography>
                    </Box>
                  </Box>
                  
                  {(viewingTournament.currentRegistrations || 0) >= viewingTournament.maxSlots && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Tournament is Full! No more registrations accepted.
                      </Typography>
                    </Alert>
                  )}
                  
                  {(viewingTournament.currentRegistrations || 0) >= viewingTournament.maxSlots * 0.8 && 
                   (viewingTournament.currentRegistrations || 0) < viewingTournament.maxSlots && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Tournament is almost full! Only {viewingTournament.maxSlots - (viewingTournament.currentRegistrations || 0)} slots remaining.
                      </Typography>
                    </Alert>
                  )}
                </Paper>
                
                {/* Tournament Details */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Tournament Information
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Status:</strong> {viewingTournament.status.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Max Slots:</strong> {viewingTournament.maxSlots}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Created:</strong> {formatDate(viewingTournament.createdAt)}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Last Updated:</strong> {formatDate(viewingTournament.updatedAt)}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                        Configuration
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Colleges:</strong> {viewingTournament.colleges?.length || 0}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Games:</strong> {viewingTournament.games?.length || 0}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Available Slots:</strong> {viewingTournament.maxSlots - (viewingTournament.currentRegistrations || 0)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}