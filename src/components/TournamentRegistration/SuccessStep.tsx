'use client';

import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { CheckCircle, Home, EmojiEvents } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { RegistrationData } from '../../app/dashboard/tournament-registration/page';

interface SuccessStepProps {
  registrationData: RegistrationData;
}

export default function SuccessStep({ registrationData }: SuccessStepProps) {
  const router = useRouter();

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleViewTournaments = () => {
    router.push('/dashboard/tournaments');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper
        sx={{
          p: 6,
          borderRadius: 4,
          background: '#FFFFFF',
          boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.1), -12px -12px 24px rgba(255, 255, 255, 0.9)',
          border: '1px solid #f0f0f0',
          textAlign: 'center',
          maxWidth: 500,
          width: '100%',
        }}
      >
        {/* Success Icon */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 3rem auto',
            boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
          }}
        >
          <CheckCircle sx={{ fontSize: 60, color: '#fff' }} />
        </Box>

        {/* Success Message */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
          }}
        >
          Registration Successful!
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: '#666',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          You are successfully registered for Campus Showdown. Your registration details have been saved securely and will appear in your tournaments list.
        </Typography>

        {/* Registration Details */}
        <Box
          sx={{
            background: '#f8f9fa',
            borderRadius: 2,
            p: 3,
            mb: 4,
            textAlign: 'left',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#333',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Registration Details
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              College:
            </Typography>
            <Chip
              label={registrationData.college}
              size="small"
              sx={{
                background: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 500,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Game:
            </Typography>
            <Chip
              label={registrationData.game}
              size="small"
              sx={{
                background: '#e8f5e8',
                color: '#4caf50',
                fontWeight: 500,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Team:
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#333',
                fontWeight: 500,
              }}
            >
              {registrationData.teamName}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Home />}
            onClick={handleGoToDashboard}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: 14,
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
            Dashboard
          </Button>

          <Button
            variant="contained"
            startIcon={<EmojiEvents />}
            onClick={handleViewTournaments}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: 14,
              fontWeight: 600,
              background: '#1976d2',
              color: '#fff',
              boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)',
              '&:hover': {
                background: '#1565c0',
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.12), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            View Tournaments
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}