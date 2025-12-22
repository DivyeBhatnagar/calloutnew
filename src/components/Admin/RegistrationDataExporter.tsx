'use client';

import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { Download, Visibility } from '@mui/icons-material';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface RegistrationData {
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

export default function RegistrationDataExporter() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRegistrations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const allRegistrations: RegistrationData[] = [];

      // Fetch from registrations collection
      try {
        const registrationsRef = collection(db, 'registrations');
        const querySnapshot = await getDocs(registrationsRef);
        
        querySnapshot.forEach((doc) => {
          allRegistrations.push({ id: doc.id, ...doc.data() } as RegistrationData);
        });
        
        console.log(`Found ${allRegistrations.length} registrations in main collection`);
      } catch (err) {
        console.log('Error fetching from registrations collection:', err);
      }

      // Also fetch from user subcollections to get all registrations
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        for (const userDoc of usersSnapshot.docs) {
          try {
            const userRegistrationsRef = collection(db, 'users', userDoc.id, 'tournament_registrations');
            const userRegSnapshot = await getDocs(userRegistrationsRef);
            
            userRegSnapshot.forEach((regDoc) => {
              // Check if this registration already exists (avoid duplicates)
              const existingReg = allRegistrations.find(r => 
                r.userId === userDoc.id && 
                r.teamName === regDoc.data().teamName &&
                r.game === regDoc.data().game
              );
              
              if (!existingReg) {
                allRegistrations.push({ 
                  id: `${userDoc.id}_${regDoc.id}`, 
                  ...regDoc.data() 
                } as RegistrationData);
              }
            });
          } catch (userErr) {
            console.log(`Error fetching registrations for user ${userDoc.id}:`, userErr);
          }
        }
        
        console.log(`Total registrations found: ${allRegistrations.length}`);
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
      
      if (allRegistrations.length === 0) {
        setError('No registrations found. Make sure users have registered and you have proper permissions.');
      }
      
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setError(`Failed to fetch registrations: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (registrations.length === 0) {
      alert('No data to download');
      return;
    }

    // CSV Headers
    const headers = [
      'Registration ID',
      'Tournament',
      'College',
      'Game',
      'Username',
      'Email',
      'User ID',
      'Phone Number',
      'Team Name',
      'IGL Name',
      'IGL Contact',
      'Player IDs',
      'Player Count',
      'Registration Date',
      'Status'
    ];

    // Convert data to CSV format
    const csvData = registrations.map(reg => [
      reg.id,
      reg.tournament || 'Campus Showdown',
      reg.college || '',
      reg.game || '',
      reg.username || '',
      reg.email || '',
      reg.userId || '',
      reg.phoneNumber || '',
      reg.teamName || '',
      reg.iglName || '',
      reg.iglContact || '',
      (reg.playerIds || []).join('; '),
      reg.playerCount || reg.playerIds?.length || 0,
      reg.registeredAt ? new Date(reg.registeredAt.seconds * 1000).toLocaleString() : '',
      reg.status || 'registered'
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tournament_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    if (registrations.length === 0) {
      alert('No data to download');
      return;
    }

    const jsonData = JSON.stringify(registrations, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tournament_registrations_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        📊 Tournament Registration Data Exporter
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This tool allows you to view and download all tournament registration data from Firestore.
      </Alert>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Visibility />}
          onClick={fetchRegistrations}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load Registrations'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={downloadCSV}
          disabled={registrations.length === 0}
        >
          Download CSV
        </Button>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={downloadJSON}
          disabled={registrations.length === 0}
        >
          Download JSON
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Registration Count */}
      {registrations.length > 0 && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Found {registrations.length} tournament registrations
        </Alert>
      )}

      {/* Data Table */}
      {registrations.length > 0 && (
        <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Team Name</TableCell>
                <TableCell>College</TableCell>
                <TableCell>Game</TableCell>
                <TableCell>IGL Name</TableCell>
                <TableCell>Players</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{reg.teamName}</TableCell>
                  <TableCell>
                    <Chip label={reg.college} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Chip label={reg.game} size="small" color="secondary" />
                  </TableCell>
                  <TableCell>{reg.iglName}</TableCell>
                  <TableCell>{reg.playerCount || reg.playerIds?.length || 0}</TableCell>
                  <TableCell>{reg.phoneNumber}</TableCell>
                  <TableCell>
                    {reg.registeredAt 
                      ? new Date(reg.registeredAt.seconds * 1000).toLocaleDateString()
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={reg.status || 'registered'} 
                      size="small" 
                      color="success" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}