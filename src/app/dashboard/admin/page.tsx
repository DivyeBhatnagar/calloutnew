'use client';

import ProtectedRoute from '../../../components/ProtectedRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import RegistrationDataExporter from '../../../components/Admin/RegistrationDataExporter';
import { Container, Typography, Box, Alert } from '@mui/material';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            {/* Header */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 2,
              }}
            >
              Admin Dashboard
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                mb: 4,
              }}
            >
              Manage tournament registrations and export data
            </Typography>

            <Alert severity="warning" sx={{ mb: 4 }}>
              <strong>Admin Access:</strong> This page allows you to view and download all tournament registration data. 
              Make sure you have proper permissions in Firestore to access this data.
            </Alert>

            {/* Registration Data Exporter */}
            <RegistrationDataExporter />
          </Box>
        </Container>
      </DashboardLayout>
    </ProtectedRoute>
  );
}