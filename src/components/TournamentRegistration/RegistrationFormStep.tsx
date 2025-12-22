'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Paper, 
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { RegistrationData } from '../../app/dashboard/tournament-registration/page';

interface RegistrationFormStepProps {
  onSubmit: (formData: Partial<RegistrationData>) => void;
  onBack: () => void;
  selectedGame: string;
  registrationData: RegistrationData;
}

export default function RegistrationFormStep({ 
  onSubmit, 
  onBack, 
  selectedGame, 
  registrationData 
}: RegistrationFormStepProps) {
  const { user, userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    teamName: '',
    iglName: '',
    iglContact: '',
    playerIds: ['', '', '', '', ''], // 5 slots, last one optional
  });

  // Auto-fill user data
  const username = userProfile?.username || user?.displayName || 'User';
  const email = user?.email || '';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlayerIdChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      playerIds: prev.playerIds.map((id, i) => i === index ? value : id),
    }));
  };

  const validateForm = () => {
    const { phoneNumber, teamName, iglName, iglContact, playerIds } = formData;
    
    // Check required fields
    if (!phoneNumber || !teamName || !iglName || !iglContact) {
      return false;
    }

    // Check minimum 4 players
    const filledPlayerIds = playerIds.filter(id => id.trim() !== '');
    if (filledPlayerIds.length < 4) {
      return false;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber) || !phoneRegex.test(iglContact)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare registration data
      const registrationPayload = {
        ...registrationData,
        ...formData,
        username,
        email,
        userId: user?.uid,
        registeredAt: new Date(),
        status: 'registered',
      };

      // Save to Firestore
      await addDoc(collection(db, 'tournament_registrations'), registrationPayload);

      // Call onSubmit to move to success step
      onSubmit(formData);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlayerLabel = () => {
    return selectedGame === 'BGMI' ? 'Player ID' : 'Player UID';
  };

  const isFormValid = validateForm();

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
          }}
        >
          Registration Form
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: 16,
          }}
        >
          Complete your tournament registration for {selectedGame}
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          background: '#FFFFFF',
          boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
          border: '1px solid #f0f0f0',
        }}
      >
        {/* Auto-filled Section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#333',
            mb: 2,
          }}
        >
          Account Information
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: '#f8f9fa',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              disabled
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  background: '#f8f9fa',
                },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* User Input Section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#333',
            mb: 2,
          }}
        >
          Team Information
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number *"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="1234567890"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Team Name *"
              value={formData.teamName}
              onChange={(e) => handleInputChange('teamName', e.target.value)}
              placeholder="Enter team name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IGL Name *"
              value={formData.iglName}
              onChange={(e) => handleInputChange('iglName', e.target.value)}
              placeholder="In-Game Leader name"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="IGL Contact Number *"
              value={formData.iglContact}
              onChange={(e) => handleInputChange('iglContact', e.target.value)}
              placeholder="1234567890"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Player IDs Section */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: '#333',
            mb: 2,
          }}
        >
          Player {getPlayerLabel()}s
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mb: 3,
          }}
        >
          Minimum 4 players required. 5th player is optional (substitute).
        </Typography>

        <Grid container spacing={2}>
          {formData.playerIds.map((playerId, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <TextField
                fullWidth
                label={`${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} ${getPlayerLabel()} ${index === 4 ? '(Optional)' : '*'}`}
                value={playerId}
                onChange={(e) => handlePlayerIdChange(index, e.target.value)}
                placeholder={`Enter ${getPlayerLabel().toLowerCase()}`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          disabled={loading}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 500,
            borderColor: '#ddd',
            color: '#666',
            '&:hover': {
              borderColor: '#1976d2',
              color: '#1976d2',
              background: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 600,
            background: isFormValid ? '#1976d2' : '#ccc',
            color: '#fff',
            boxShadow: isFormValid 
              ? '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
              : 'none',
            '&:hover': {
              background: isFormValid ? '#1565c0' : '#ccc',
              transform: isFormValid ? 'translateY(-1px)' : 'none',
            },
            '&:disabled': {
              color: '#999',
            },
          }}
        >
          {loading ? 'Registering...' : 'Register for Tournament'}
        </Button>
      </Box>
    </Box>
  );
}