'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  Skeleton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Visibility,
  Download,
  FilterList,
  Search,
  People,
  EmojiEvents,
  School,
  SportsEsports,
  CalendarToday,
  Phone,
  Email,
  Delete,
  Warning,
} from '@mui/icons-material';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface Registration {
  id: string;
  tournament: string;
  college: string;
  game: string;
  username: string;
  email: string;
  userId: string;
  phoneNumber: string;
  teamName: string;
  iglName: string;
  iglContact: string;
  playerIds: string[];
  playerCount: number;
  registeredAt: any;
  status: string;
}

export default function RegistrationManager() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    tournaments: 0,
    colleges: 0,
    games: 0,
  });

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [registrations, searchTerm, tournamentFilter, gameFilter, collegeFilter, statusFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const allRegistrations: Registration[] = [];

      // Fetch from registrations collection
      try {
        const registrationsRef = collection(db, 'registrations');
        const querySnapshot = await getDocs(registrationsRef);
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Skip if this is a query (has queryType field) instead of registration
          if (!data.queryType) {
            allRegistrations.push({ id: doc.id, ...data } as Registration);
          }
        });
      } catch (err) {
        console.log('Error fetching from registrations collection:', err);
      }

      // Also fetch from user subcollections
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        for (const userDoc of usersSnapshot.docs) {
          try {
            const userRegistrationsRef = collection(db, 'users', userDoc.id, 'tournament_registrations');
            const userRegSnapshot = await getDocs(userRegistrationsRef);
            
            userRegSnapshot.forEach((regDoc) => {
              const data = regDoc.data();
              // Skip if this is a query instead of registration
              if (!data.queryType) {
                const existingReg = allRegistrations.find(r => 
                  r.userId === userDoc.id && 
                  r.teamName === data.teamName &&
                  r.game === data.game
                );
                
                if (!existingReg) {
                  allRegistrations.push({ 
                    id: `${userDoc.id}_${regDoc.id}`, 
                    ...data 
                  } as Registration);
                }
              }
            });
          } catch (userErr) {
            console.log(`Error fetching registrations for user ${userDoc.id}:`, userErr);
          }
        }
      } catch (err) {
        console.log('Error fetching from user subcollections:', err);
      }

      // Sort by registration date (newest first)
      allRegistrations.sort((a, b) => {
        const dateA = a.registeredAt?.seconds || 0;
        const dateB = b.registeredAt?.seconds || 0;
        return dateB - dateA;
      });

      setRegistrations(allRegistrations);
      
      // Calculate statistics
      const uniqueTournaments = new Set(allRegistrations.map(r => r.tournament)).size;
      const uniqueColleges = new Set(allRegistrations.map(r => r.college)).size;
      const uniqueGames = new Set(allRegistrations.map(r => r.game)).size;
      
      setStats({
        total: allRegistrations.length,
        tournaments: uniqueTournaments,
        colleges: uniqueColleges,
        games: uniqueGames,
      });
      
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError(`Failed to fetch registrations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...registrations];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(reg =>
        reg.teamName?.toLowerCase().includes(term) ||
        reg.iglName?.toLowerCase().includes(term) ||
        reg.username?.toLowerCase().includes(term) ||
        reg.email?.toLowerCase().includes(term) ||
        reg.phoneNumber?.includes(term)
      );
    }

    // Tournament filter
    if (tournamentFilter) {
      filtered = filtered.filter(reg => reg.tournament === tournamentFilter);
    }

    // Game filter
    if (gameFilter) {
      filtered = filtered.filter(reg => reg.game === gameFilter);
    }

    // College filter
    if (collegeFilter) {
      filtered = filtered.filter(reg => reg.college === collegeFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(reg => (reg.status || 'registered') === statusFilter);
    }

    setFilteredRegistrations(filtered);
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTournamentFilter('');
    setGameFilter('');
    setCollegeFilter('');
    setStatusFilter('');
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setDetailsOpen(true);
  };

  const handleDeleteRegistration = (registration: Registration) => {
    setRegistrationToDelete(registration);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRegistration = async () => {
    if (!registrationToDelete) return;

    setDeleting(true);
    try {
      // Try to delete from main registrations collection
      if (!registrationToDelete.id.includes('_')) {
        await deleteDoc(doc(db, 'registrations', registrationToDelete.id));
      } else {
        // Handle user subcollection deletion
        const [userId, regId] = registrationToDelete.id.split('_');
        await deleteDoc(doc(db, 'users', userId, 'tournament_registrations', regId));
      }
      
      // Update local state
      const updatedRegistrations = registrations.filter(r => r.id !== registrationToDelete.id);
      setRegistrations(updatedRegistrations);
      
      // Also update filtered registrations
      setFilteredRegistrations(prev => prev.filter(r => r.id !== registrationToDelete.id));
      
      // Update statistics
      const uniqueTournaments = new Set(updatedRegistrations.map(r => r.tournament)).size;
      const uniqueColleges = new Set(updatedRegistrations.map(r => r.college)).size;
      const uniqueGames = new Set(updatedRegistrations.map(r => r.game)).size;
      
      setStats({
        total: updatedRegistrations.length,
        tournaments: uniqueTournaments,
        colleges: uniqueColleges,
        games: uniqueGames,
      });
      
      setDeleteDialogOpen(false);
      setRegistrationToDelete(null);
      
      console.log(`✅ Registration "${registrationToDelete.teamName}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting registration:', error);
      setError(`Failed to delete registration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleting(false);
    }
  };

  const downloadCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No data to download');
      return;
    }

    const headers = [
      'Team Name', 'Tournament', 'College', 'Game', 'IGL Name', 'IGL Contact',
      'Username', 'Email', 'Phone', 'Player Count', 'Player IDs', 'Registration Date', 'Status'
    ];

    const csvData = filteredRegistrations.map(reg => [
      reg.teamName || '',
      reg.tournament || 'Campus Showdown',
      reg.college || '',
      reg.game || '',
      reg.iglName || '',
      reg.iglContact || '',
      reg.username || '',
      reg.email || '',
      reg.phoneNumber || '',
      reg.playerCount || reg.playerIds?.length || 0,
      (reg.playerIds || []).join('; '),
      reg.registeredAt ? new Date(reg.registeredAt.seconds * 1000).toLocaleString() : '',
      reg.status || 'registered'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueValues = (field: keyof Registration) => {
    return Array.from(new Set(registrations.map(reg => reg[field]).filter(Boolean)));
  };

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Registration Management
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={30} />
                  <Skeleton variant="text" width="40%" height={40} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rectangular" height={400} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Registration Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={downloadCSV}
          disabled={filteredRegistrations.length === 0}
          sx={{ 
            borderRadius: 2,
            background: '#1976d2',
            boxShadow: '4px 4px 8px rgba(25, 118, 210, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(25, 118, 210, 0.2)',
            '&:hover': {
              background: '#1565c0',
              boxShadow: '6px 6px 12px rgba(25, 118, 210, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.9)',
            },
            '&:disabled': {
              background: '#f5f5f5',
              color: '#999',
              boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          Export CSV
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <People sx={{ fontSize: 40, mb: 2, color: '#1976d2' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Total Registrations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <EmojiEvents sx={{ fontSize: 40, mb: 2, color: '#2e7d32' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {stats.tournaments}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Tournaments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <School sx={{ fontSize: 40, mb: 2, color: '#ed6c02' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02', mb: 1 }}>
                {stats.colleges}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Colleges
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            borderRadius: 3, 
            background: '#FFFFFF',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            border: '1px solid #f0f0f0',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <SportsEsports sx={{ fontSize: 40, mb: 2, color: '#7b1fa2' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#7b1fa2', mb: 1 }}>
                {stats.games}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Games
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        background: '#FFFFFF',
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        border: '1px solid #f0f0f0',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterList sx={{ mr: 1, color: '#666' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            Filters
          </Typography>
          <Button onClick={clearFilters} size="small">
            Clear All
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Team name, IGL, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#666' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Tournament</InputLabel>
              <Select
                value={tournamentFilter}
                label="Tournament"
                onChange={(e) => setTournamentFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {getUniqueValues('tournament').map((tournament) => (
                  <MenuItem key={tournament} value={tournament}>
                    {tournament}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Game</InputLabel>
              <Select
                value={gameFilter}
                label="Game"
                onChange={(e) => setGameFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {getUniqueValues('game').map((game) => (
                  <MenuItem key={game} value={game}>
                    {game}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>College</InputLabel>
              <Select
                value={collegeFilter}
                label="College"
                onChange={(e) => setCollegeFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {getUniqueValues('college').map((college) => (
                  <MenuItem key={college} value={college}>
                    {college}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="registered">Registered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Showing {filteredRegistrations.length} of {registrations.length} registrations
        </Typography>
      </Box>

      {/* Registrations Table */}
      <Paper sx={{ 
        borderRadius: 3, 
        overflow: 'hidden',
        background: '#FFFFFF',
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        border: '1px solid #f0f0f0',
      }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Team Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tournament</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>College</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Game</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IGL Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Players</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegistrations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((registration) => (
                  <TableRow key={registration.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {registration.teamName}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={registration.tournament || 'Campus Showdown'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={registration.college} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={registration.game} 
                        size="small" 
                        sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                      />
                    </TableCell>
                    <TableCell>{registration.iglName}</TableCell>
                    <TableCell>
                      <Badge 
                        badgeContent={registration.playerCount || registration.playerIds?.length || 0} 
                        color="primary"
                      >
                        <People />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(registration.registeredAt)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={registration.status || 'registered'} 
                        size="small" 
                        color={registration.status === 'cancelled' ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(registration)}
                            sx={{ color: '#1976d2' }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Registration">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteRegistration(registration)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredRegistrations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Registration Details Modal */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Registration Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedRegistration && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Team Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Team Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedRegistration.teamName}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">IGL Name</Typography>
                    <Typography variant="body1">{selectedRegistration.iglName}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Player Count</Typography>
                    <Typography variant="body1">
                      {selectedRegistration.playerCount || selectedRegistration.playerIds?.length || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Player IDs</Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedRegistration.playerIds?.join(', ') || 'N/A'}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Contact Information
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">IGL Contact</Typography>
                      <Typography variant="body1">{selectedRegistration.iglContact}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedRegistration.email}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Registration Date</Typography>
                      <Typography variant="body1">
                        {formatDate(selectedRegistration.registeredAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Tournament Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Tournament</Typography>
                        <Chip 
                          label={selectedRegistration.tournament || 'Campus Showdown'} 
                          color="primary" 
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">College</Typography>
                        <Chip 
                          label={selectedRegistration.college} 
                          color="secondary" 
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Game</Typography>
                        <Chip 
                          label={selectedRegistration.game} 
                          sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Registration Confirmation Dialog */}
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
              Delete Registration
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {registrationToDelete && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  ⚠️ Warning
                </Typography>
                This action cannot be undone. The registration will be permanently deleted.
              </Alert>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to delete this registration?
              </Typography>
              
              <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Registration Details:
                </Typography>
                <Typography variant="body2">
                  <strong>Team:</strong> {registrationToDelete.teamName}
                </Typography>
                <Typography variant="body2">
                  <strong>IGL:</strong> {registrationToDelete.iglName}
                </Typography>
                <Typography variant="body2">
                  <strong>Game:</strong> {registrationToDelete.game}
                </Typography>
                <Typography variant="body2">
                  <strong>College:</strong> {registrationToDelete.college}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDeleteRegistration} 
            variant="contained" 
            color="error"
            disabled={deleting}
            startIcon={<Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete Registration'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}