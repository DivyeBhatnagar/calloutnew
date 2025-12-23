'use client';

import AdminRoute from '../../../components/AdminRoute';
import DashboardLayout from '../../../components/Dashboard/DashboardLayout';
import RegistrationDataExporter from '../../../components/Admin/RegistrationDataExporter';
import QueryManager from '../../../components/Admin/QueryManager';
import AdminUserManager from '../../../components/Admin/AdminUserManager';
import AdminStatusChecker from '../../../components/Admin/AdminStatusChecker';
import { Container, Typography, Box, Alert, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <AdminRoute>
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
              Manage tournament registrations, queries, and export data
            </Typography>

            <Alert severity="warning" sx={{ mb: 4 }}>
              <strong>Admin Access:</strong> This page allows you to view and manage all platform data. 
              Make sure you have proper permissions in Firestore to access this data.
            </Alert>

            {/* Admin Status Checker */}
            <AdminStatusChecker />

            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{ mb: 4, borderBottom: '1px solid #f0f0f0' }}
            >
              <Tab label="Tournament Registrations" />
              <Tab label="User Queries" />
              <Tab label="User Management" />
            </Tabs>

            {/* Tab Content */}
            {tabValue === 0 && <RegistrationDataExporter />}
            {tabValue === 1 && <QueryManager />}
            {tabValue === 2 && <AdminUserManager />}
          </Box>
        </Container>
      </DashboardLayout>
    </AdminRoute>
  );
}