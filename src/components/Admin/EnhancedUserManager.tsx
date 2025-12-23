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
  Grid,
  Card,
  CardContent,
  Alert,
  Skeleton,
  Tooltip,
  Badge,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Visibility,
  Edit,
  Search,
  People,
  AdminPanelSettings,
  Person,
  CalendarToday,
  Email,
  Phone,
  EmojiEvents,
  ContactSupport,
  Security,
  Warning,
} from '@mui/icons-material';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: any;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  lastLoginAt?: any;
  registrationCount?: number;
  queryCount?: number;
}

export default function EnhancedUserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [roleChangeOpen, setRoleChangeOpen] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [updating, setUpdating] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    newUsersThisMonth: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const usersList: User[] = [];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      let newUsersCount = 0;
      
      for (const userDoc of querySnapshot.docs) {
        const userData = userDoc.data();
        
        // Count registrations for this user
        let registrationCount = 0;
        try {
          const userRegistrationsRef = collection(db, 'users', userDoc.id, 'tournament_registrations');
          const regSnapshot = await getDocs(userRegistrationsRef);
          registrationCount = regSnapshot.size;
        } catch (err) {
          console.log(`Error counting registrations for user ${userDoc.id}:`, err);
        }

        // Count queries for this user
        let queryCount = 0;
        try {
          const userQueriesRef = collection(db, 'users', userDoc.id, 'queries');
          const querySnapshot = await getDocs(userQueriesRef);
          queryCount = querySnapshot.size;
        } catch (err) {
          console.log(`Error counting queries for user ${userDoc.id}:`, err);
        }

        // Check if user is new this month
        if (userData.createdAt) {
          const createdDate = new Date(userData.createdAt.seconds * 1000);
          if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) {
            newUsersCount++;
          }
        }
        
        usersList.push({
          id: userDoc.id,
          ...userData,
          registrationCount,
          queryCount,
        } as User);
      }

      // Sort by creation date (newest first)
      usersList.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });

      setUsers(usersList);
      
      // Calculate statistics
      const adminCount = usersList.filter(u => u.role === 'admin').length;
      const regularCount = usersList.filter(u => u.role === 'user').length;
      
      setStats({
        totalUsers: usersList.length,
        adminUsers: adminCount,
        regularUsers: regularCount,
        newUsersThisMonth: newUsersCount,
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(`Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.displayName?.toLowerCase().includes(term)
      );
    }

    // Role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role === 'admin' ? 'user' : 'admin');
    setRoleChangeOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;

    setUpdating(true);
    try {
      const userRef = doc(db, 'users', selectedUser.id);
      await updateDoc(userRef, { role: newRole });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole }
          : user
      ));
      
      setRoleChangeOpen(false);
      setSelectedUser(null);
      
      // Refresh stats
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, role: newRole }
          : user
      );
      
      const adminCount = updatedUsers.filter(u => u.role === 'admin').length;
      const regularCount = updatedUsers.filter(u => u.role === 'user').length;
      
      setStats(prev => ({
        ...prev,
        adminUsers: adminCount,
        regularUsers: regularCount,
      }));
      
    } catch (error) {
      console.error('Error updating user role:', error);
      setError(`Failed to update user role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdating(false);
    }
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

  if (loading) {
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          User Management
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
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        User Management
      </Typography>

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
                {stats.totalUsers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Total Users
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
              <AdminPanelSettings sx={{ fontSize: 40, mb: 2, color: '#d32f2f' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#d32f2f', mb: 1 }}>
                {stats.adminUsers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Admin Users
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
              <Person sx={{ fontSize: 40, mb: 2, color: '#2e7d32' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 1 }}>
                {stats.regularUsers}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                Regular Users
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
              <CalendarToday sx={{ fontSize: 40, mb: 2, color: '#ed6c02' }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ed6c02', mb: 1 }}>
                {stats.newUsersThisMonth}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
                New This Month
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
          <Search sx={{ mr: 1, color: '#666' }} />
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            Filters
          </Typography>
          <Button onClick={clearFilters} size="small">
            Clear All
          </Button>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Users"
              placeholder="Username, email, display name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#666' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="user">Regular Users</MenuItem>
                <MenuItem value="admin">Admin Users</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Showing {filteredUsers.length} of {users.length} users
        </Typography>
      </Box>

      {/* Users Table */}
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
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Registrations</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Queries</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: user.role === 'admin' 
                              ? 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)'
                              : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        >
                          {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.username || user.displayName || 'No Name'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id.substring(0, 8)}...
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.toUpperCase()} 
                        size="small" 
                        color={user.role === 'admin' ? 'error' : 'primary'}
                        icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge 
                        badgeContent={user.registrationCount || 0} 
                        color="primary"
                        showZero
                      >
                        <EmojiEvents />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        badgeContent={user.queryCount || 0} 
                        color="secondary"
                        showZero
                      >
                        <ContactSupport />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(user)}
                            sx={{ color: '#1976d2' }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Role">
                          <IconButton
                            size="small"
                            onClick={() => handleRoleChange(user)}
                            sx={{ color: '#ed6c02' }}
                          >
                            <Security />
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* User Details Modal */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            User Details
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Basic Information
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Username</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedUser.username || 'Not set'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Display Name</Typography>
                    <Typography variant="body1">{selectedUser.displayName || 'Not set'}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">{selectedUser.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Role</Typography>
                    <Chip 
                      label={selectedUser.role.toUpperCase()} 
                      color={selectedUser.role === 'admin' ? 'error' : 'primary'}
                      icon={selectedUser.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                    />
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Activity Statistics
                  </Typography>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <EmojiEvents sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Tournament Registrations</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedUser.registrationCount || 0}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <ContactSupport sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Support Queries</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedUser.queryCount || 0}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Account Created</Typography>
                      <Typography variant="body1">
                        {formatDate(selectedUser.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Account Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">User ID</Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                          {selectedUser.id}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Last Login</Typography>
                        <Typography variant="body1">
                          {selectedUser.lastLoginAt ? formatDate(selectedUser.lastLoginAt) : 'Never'}
                        </Typography>
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

      {/* Role Change Confirmation Modal */}
      <Dialog 
        open={roleChangeOpen} 
        onClose={() => setRoleChangeOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Warning sx={{ mr: 1, color: '#ed6c02' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Change User Role
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 1 }}>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  ⚠️ Security Warning
                </Typography>
                You are about to change the role of this user. This action will immediately affect their access permissions.
              </Alert>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                Change role for user: <strong>{selectedUser.username || selectedUser.email}</strong>
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body2">Current Role:</Typography>
                <Chip 
                  label={selectedUser.role.toUpperCase()} 
                  color={selectedUser.role === 'admin' ? 'error' : 'primary'}
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2">New Role:</Typography>
                <Chip 
                  label={newRole.toUpperCase()} 
                  color={newRole === 'admin' ? 'error' : 'primary'}
                  size="small"
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                {newRole === 'admin' 
                  ? '• User will gain admin access to all platform features\n• User can manage tournaments, view all data, and modify user roles'
                  : '• User will lose admin access\n• User will only have access to regular user features'
                }
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleChangeOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmRoleChange} 
            variant="contained" 
            color={newRole === 'admin' ? 'error' : 'primary'}
            disabled={updating}
          >
            {updating ? 'Updating...' : `Change to ${newRole.toUpperCase()}`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}