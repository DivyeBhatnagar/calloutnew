'use client';

import { useState } from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import TournamentSelectionStep from '../../../components/TournamentRegistration/TournamentSelectionStep';
import DynamicCollegeSelectionStep from '../../../components/TournamentRegistration/DynamicCollegeSelectionStep';
import DynamicGameSelectionStep from '../../../components/TournamentRegistration/DynamicGameSelectionStep';
import RegistrationFormStep from '../../../components/TournamentRegistration/RegistrationFormStep';
import SuccessStep from '../../../components/TournamentRegistration/SuccessStep';
import StepIndicator from '../../../components/TournamentRegistration/StepIndicator';
import { Container, Box } from '@mui/material';

export interface RegistrationData {
  tournament: string;
  tournamentId: string;
  college: string;
  game: string;
  teamName: string;
  iglName: string;
  iglContact: string;
  phoneNumber: string;
  playerIds: string[];
}

interface Tournament {
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  status: 'draft' | 'active' | 'closed';
  colleges: Array<{
    id: string;
    name: string;
    logoUrl: string;
  }>;
  games: Array<{
    id: string;
    name: string;
    logoUrl: string;
  }>;
}

export default function TournamentRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    tournament: '',
    tournamentId: '',
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

  const handleTournamentSelect = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setRegistrationData(prev => ({ 
      ...prev, 
      tournament: tournament.name,
      tournamentId: tournament.id 
    }));
    handleNext();
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
        return (
          <TournamentSelectionStep
            onSelect={handleTournamentSelect}
            selectedTournament={selectedTournament}
          />
        );
      case 2:
        return selectedTournament ? (
          <DynamicCollegeSelectionStep
            tournament={selectedTournament}
            onSelect={handleCollegeSelect}
            onBack={handleBack}
            selectedCollege={registrationData.college}
          />
        ) : null;
      case 3:
        return selectedTournament ? (
          <DynamicGameSelectionStep
            tournament={selectedTournament}
            selectedCollege={registrationData.college}
            onSelect={handleGameSelect}
            onBack={handleBack}
            selectedGame={registrationData.game}
          />
        ) : null;
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
        return (
          <TournamentSelectionStep
            onSelect={handleTournamentSelect}
            selectedTournament={selectedTournament}
          />
        );
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