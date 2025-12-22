'use client';

import { Box, Typography, Stepper, Step, StepLabel } from '@mui/material';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const steps = [
  'Event Details',
  'Select College',
  'Choose Game',
  'Registration Form'
];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        borderRadius: 3,
        p: 3,
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
        border: '1px solid #f0f0f0',
      }}
    >
      <Stepper
        activeStep={currentStep - 1}
        alternativeLabel
        sx={{
          '& .MuiStepLabel-root .Mui-completed': {
            color: '#1976d2',
          },
          '& .MuiStepLabel-root .Mui-active': {
            color: '#1976d2',
          },
          '& .MuiStepConnector-alternativeLabel': {
            top: 10,
            left: 'calc(-50% + 16px)',
            right: 'calc(50% + 16px)',
          },
          '& .MuiStepConnector-alternativeLabel.Mui-active .MuiStepConnector-line': {
            borderColor: '#1976d2',
          },
          '& .MuiStepConnector-alternativeLabel.Mui-completed .MuiStepConnector-line': {
            borderColor: '#1976d2',
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: 14,
                  fontWeight: 500,
                  color: index < currentStep ? '#1976d2' : '#999',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}