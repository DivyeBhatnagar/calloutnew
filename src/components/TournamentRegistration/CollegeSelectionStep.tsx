'use client';

import { useState } from 'react';
import { Box, Typography, Button, Paper, Grid, Card, CardContent } from '@mui/material';
import { Check, ArrowBack } from '@mui/icons-material';
import Image from 'next/image';

interface CollegeSelectionStepProps {
  onSelect: (college: string) => void;
  onBack: () => void;
  selectedCollege: string;
}

const colleges = [
  {
    id: 'IILM',
    name: 'IILM University',
    logo: '/Media/Colleges/IILM.png',
  },
  {
    id: 'IIMT',
    name: 'IIMT College',
    logo: '/Media/Colleges/IIMT.png',
  },
  {
    id: 'NIET',
    name: 'NIET College',
    logo: '/Media/Colleges/NIET.jpg',
  },
];

export default function CollegeSelectionStep({ onSelect, onBack, selectedCollege }: CollegeSelectionStepProps) {
  const [selected, setSelected] = useState(selectedCollege);

  const handleCollegeClick = (collegeId: string) => {
    setSelected(collegeId);
  };

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
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
          Select Your College
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#666',
            fontSize: 16,
          }}
        >
          Choose the college you represent in this tournament
        </Typography>
      </Box>

      {/* College Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {colleges.map((college) => (
          <Grid item xs={12} sm={6} md={4} key={college.id}>
            <Card
              onClick={() => handleCollegeClick(college.id)}
              sx={{
                cursor: 'pointer',
                borderRadius: 3,
                background: '#FFFFFF',
                border: selected === college.id ? '3px solid #1976d2' : '1px solid #f0f0f0',
                boxShadow: selected === college.id 
                  ? '8px 8px 16px rgba(25, 118, 210, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  : '6px 6px 12px rgba(0, 0, 0, 0.08), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.12), -10px -10px 20px rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                {/* College Logo */}
                <Box
                  sx={{
                    width: 120,
                    height: 60,
                    borderRadius: 2,
                    overflow: 'hidden',
                    margin: '0 auto 1.5rem auto',
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 1,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Image
                    src={college.logo}
                    alt={college.name}
                    width={120}
                    height={60}
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                    priority
                  />
                </Box>

                {/* College Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#333',
                    fontSize: 16,
                  }}
                >
                  {college.name}
                </Typography>

                {/* Selected Indicator */}
                {selected === college.id && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <Check sx={{ fontSize: 18, color: '#fff' }} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
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
          onClick={handleContinue}
          disabled={!selected}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: 16,
            fontWeight: 600,
            background: selected ? '#1976d2' : '#ccc',
            color: '#fff',
            boxShadow: selected 
              ? '6px 6px 12px rgba(0, 0, 0, 0.1), -6px -6px 12px rgba(255, 255, 255, 0.9)'
              : 'none',
            '&:hover': {
              background: selected ? '#1565c0' : '#ccc',
              transform: selected ? 'translateY(-1px)' : 'none',
            },
            '&:disabled': {
              color: '#999',
            },
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}