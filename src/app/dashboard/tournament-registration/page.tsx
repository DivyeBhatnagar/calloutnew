'use client';

import { useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import EventLandingStep from '../../../components/TournamentRegistration/EventLandingStep';
import CollegeSelectionStep from '../../../components/TournamentRegistration/CollegeSelectionStep';
import GameSelectionStep from '../../../components/TournamentRegistration/GameSelectionStep';
import RegistrationFormStep from '../../../components/TournamentRegistration/RegistrationFormStep';
import SuccessStep from '../../../components/TournamentRegistration/SuccessStep';
import StepIndicator from '../../../components/TournamentRegistration/StepIndicator';
import { Container, Box } from '@mui/material';

export interface RegistrationData {
  college: string;
  game: string;
  teamName: string;
  iglName: string;
  iglContact: string;
  phoneNumber: string;
  playerIds: string[];
}

export default function TournamentRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    college: '',
    game: '',
    teamName: '',
    iglName: '',
    iglContact: '',
    phoneNumber: '',
    playerIds: ['', '', '', '', ''], // 5 slots, last one optional
  });

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleCollegeSelect = (college: string) => {
    setRegistrationData(prev => ({ ...prev, college }));
    handleNext();
  };

  const handleGameSelect = (game: string) => {
    setRegistrationData(prev => ({ ...prev, game }));
    handleNext();
  };

  const handleFormSubmit = (formData: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...formData }));
    handleNext();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EventLandingStep onContinue={handleNext} />;
      case 2:
        return (
          <CollegeSelectionStep
            onSelect={handleCollegeSelect}
            onBack={handleBack}
            selectedCollege={registrationData.college}
          />
        );
      case 3:
        return (
          <GameSelectionStep
            onSelect={handleGameSelect}
            onBack={handleBack}
            selectedGame={registrationData.game}
          />
        );
      case 4:
        return (
          <RegistrationFormStep
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            selectedGame={registrationData.game}
            registrationData={registrationData}
          />
        );
      case 5:
        return (
          <SuccessStep
            registrationData={registrationData}
          />
        );
      default:
        return <EventLandingStep onContinue={handleNext} />;
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            {/* Step Indicator */}
            {currentStep <= 4 && (
              <Box sx={{ mb: 4 }}>
                <StepIndicator currentStep={currentStep} totalSteps={4} />
              </Box>
            )}

            {/* Current Step Content */}
            {renderStep()}
          </Box>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}