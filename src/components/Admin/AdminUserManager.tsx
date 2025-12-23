'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Alert, 
  Button, 
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ADMIN_EMAILS } from '../../utils/adminSetup';

interface User {
  uid: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  promotedToAdminAt?: string;
}

export default function AdminUserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [promoteDialogOpen, setPromoteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const usersList: User[] = [];
      querySnapshot.forEach((doc) => {
        usersList.push({ uid: doc.id, ...doc.data() } as User);
      });

      // Sort by role (admins first) then by creation date
      usersList.sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async () => {
    if (!selectedUser) return;

    try {
      setPromoting(true);
      
      // Verify email is in admin list
      if (!ADMIN_EMAILS.includes(selectedUser.email.toLowerCase())) {
        throw new Error(`Email ${selectedUser.email} is not in the authorized admin list`);
      }

      // Update user role to admin
      const userRef = doc(db, 'users', selectedUser.uid);
      await updateDoc(userRef, {
        role: 'admin',
        promotedToAdminAt: new Date().toISOString(),
        promotedBy: 'manual'
      });

      // Update local state
      setUsers(prev => prev.map(user => 
        user.uid === selectedUser.uid 
          ? { ...user, role: 'admin', promotedToAdminAt: new Date().toISOString() }
          : user
      ));

      setPromoteDialogOpen(false);
      setSelectedUser(null);
      
      console.log(`✅ Successfully promoted ${selectedUser.email} to admin`);
    } catch (error) {
      console.error('Error promoting user:', error);
      setError(error instanceof Error ? error.message : 'Failed to promote user');
    } finally {
      setPromoting(false);
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

  const isEligibleForAdmin = (email: string) => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading users...</Typography>
      </Paper>
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

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Admin Email List:
        </Typography>
        {ADMIN_EMAILS.map(email => (
          <Typography key={email} variant="body2" sx={{ fontFamily: 'monospace' }}>
            • {email}
          </Typography>
        ))}
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Created</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.uid}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {user.email}
                  </Typography>
                  {isEligibleForAdmin(user.email) && (
                    <Chip 
                      label="Eligible for Admin" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={user.role === 'admin' ? 'success' : 'default'}
                    size="small"
                  />
                  {user.role === 'admin' && user.promotedToAdminAt && (
                    <Typography variant="caption" sx={{ display: 'block', color: '#666', mt: 0.5 }}>
                      Promoted: {formatDate(user.promotedToAdminAt)}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(user.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {user.role !== 'admin' && isEligibleForAdmin(user.email) && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setSelectedUser(user);
                        setPromoteDialogOpen(true);
                      }}
                    >
                      Promote to Admin
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Promote User Dialog */}
      <Dialog open={promoteDialogOpen} onClose={() => setPromoteDialogOpen(false)}>
        <DialogTitle>Promote User to Admin</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Are you sure you want to promote this user to admin?
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Email: {selectedUser.email}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Username: {selectedUser.username}
              </Typography>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action will give the user full admin privileges including access to all user data and admin functions.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromoteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handlePromoteUser} 
            variant="contained" 
            color="primary"
            disabled={promoting}
          >
            {promoting ? 'Promoting...' : 'Promote to Admin'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}