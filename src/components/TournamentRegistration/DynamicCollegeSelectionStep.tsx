'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  School,
} from '@mui/icons-material';

interface College {
  id: string;
  name: string;
  logoUrl: string;
}

interface Tournament {
  id: string;
  name: string;
  colleges: College[];
}

interface DynamicCollegeSelectionStepProps {
  tournament: Tournament;
  onSelect: (college: string) => void;
  onBack: () => void;
  selectedCollege?: string;
}

export default function DynamicCollegeSelectionStep({
  tournament,
  onSelect,
  onBack,
  selectedCollege,
}: DynamicCollegeSelectionStepProps) {
  return (
    <Box sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 2,
          }}
        >
          Select Your College
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#666',
            fontWeight: 400,
            mb: 1,
          }}
        >
          Choose your college for {tournament.name}
        </Typography>
        <Chip
          label={`${tournament.colleges.length} Colleges Available`}
          sx={{
            background: '#e3f2fd',
            color: '#1976d2',
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Back Button */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Back to Tournament Selection
        </Button>
      </Box>

      {/* Colleges Grid */}
      <Grid container spacing={4}>
        {tournament.colleges.map((college) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={college.id}>
            <Card
              sx={{
                borderRadius: 3,
                background: '#FFFFFF',
                boxShadow: selectedCollege === college.name
                  ? '12px 12px 24px rgba(25, 118, 210, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
                  : '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
                border: selectedCollege === college.name
                  ? '2px solid #1976d2'
                  : '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-4px)',
                },
              }}
              onClick={() => onSelect(college.name)}
            >
              {/* Selected Indicator */}
              {selectedCollege === college.name && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    zIndex: 1,
                  }}
                >
                  <CheckCircle sx={{ color: '#1976d2', fontSize: 24 }} />
                </Box>
              )}

              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {/* College Logo */}
                <Box sx={{ mb: 2 }}>
                  <img
                    src={college.logoUrl}
                    alt={college.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'contain',
                      borderRadius: 12,
                    }}
                  />
                </Box>

                {/* College Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1a1a1a',
                    mb: 2,
                    lineHeight: 1.3,
                    minHeight: 48, // Consistent height
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {college.name}
                </Typography>

                {/* Action Button */}
                <Button
                  fullWidth
                  variant={selectedCollege === college.name ? 'contained' : 'outlined'}
                  startIcon={selectedCollege === college.name ? <CheckCircle /> : <School />}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    boxShadow: selectedCollege === college.name
                      ? '4px 4px 8px rgba(25, 118, 210, 0.2)'
                      : 'none',
                  }}
                >
                  {selectedCollege === college.name ? 'Selected' : 'Select'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Continue Button */}
      {selectedCollege && (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => onSelect(selectedCollege)}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 700,
              px: 6,
              py: 2,
              fontSize: 18,
              boxShadow: '8px 8px 16px rgba(25, 118, 210, 0.2), -8px -8px 16px rgba(255, 255, 255, 0.9)',
            }}
          >
            Continue with {selectedCollege}
          </Button>
        </Box>
      )}
    </Box>
  );
}