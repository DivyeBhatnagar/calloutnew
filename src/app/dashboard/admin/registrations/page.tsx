'use client';

import AdminRoute from '../../../../components/AdminRoute';
import AdminDashboardLayout from '../../../../components/Admin/AdminDashboardLayout';
import RegistrationManager from '../../../../components/Admin/RegistrationManager';
import { Container, Box } from '@mui/material';

export default function AdminRegistrationsPage() {
  return (
    <AdminRoute>
      <AdminDashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <RegistrationManager />
          </Box>
        </Container>
      </AdminDashboardLayout>
    </AdminRoute>
  );
}