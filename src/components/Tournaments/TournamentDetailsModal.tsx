'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Close,
  EmojiEvents,
  People,
  Phone,
  Email,
  CalendarToday,
  SportsEsports,
  School,
} from '@mui/icons-material';

interface UserRegistration {
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

interface TournamentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  registration: UserRegistration | null;
}

export default function TournamentDetailsModal({ open, onClose, registration }: TournamentDetailsModalProps) {
  if (!registration) return null;

  const getPlayerLabel = () => {
    return registration.game === 'BGMI' ? 'Player ID' : 'Player UID';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: '#FFFFFF',
          boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EmojiEvents sx={{ color: '#1976d2', fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            Tournament Registration Details
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#666' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        {/* Tournament Info Header */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {registration.tournament}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              label={registration.game}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label={registration.college}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Chip
              label="Registered"
              sx={{
                background: '#4caf50',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </Box>
        </Paper>

        {/* Team Information */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#333',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <People sx={{ color: '#1976d2' }} />
            Team Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Team Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                  {registration.teamName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  IGL Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                  {registration.iglName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  IGL Contact
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 16 }} />
                  {registration.iglContact}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 16 }} />
                  {registration.phoneNumber}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Player Information */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#333',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <SportsEsports sx={{ color: '#1976d2' }} />
            Player {getPlayerLabel()}s
          </Typography>

          <Grid container spacing={2}>
            {registration.playerIds.map((playerId, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                    {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} {getPlayerLabel()}
                    {index === 4 && ' (Substitute)'}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                    {playerId || 'Not provided'}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Total Players: {registration.playerCount} / 5
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Account Information */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#333',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Email sx={{ color: '#1976d2' }} />
            Account Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Username
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333' }}>
                  {registration.username}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 16 }} />
                  {registration.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Selected College
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ fontSize: 16 }} />
                  {registration.college}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                  Registration Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#333', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 16 }} />
                  {registration.registeredAt 
                    ? new Date(registration.registeredAt.seconds * 1000).toLocaleString()
                    : 'Recently registered'
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Status Information */}
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            background: '#e8f5e8',
            border: '1px solid #4caf50',
          }}
        >
          <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600 }}>
            ✅ Registration Status: {registration.status || 'Registered'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#2e7d32', mt: 0.5 }}>
            Your tournament registration has been successfully submitted and saved.
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}