'use client';

import AdminRoute from '../../../../components/AdminRoute';
import AdminDashboardLayout from '../../../../components/Admin/AdminDashboardLayout';
import EnhancedUserManager from '../../../../components/Admin/EnhancedUserManager';
import { Container, Box } from '@mui/material';

export default function AdminUsersPage() {
  return (
    <AdminRoute>
      <AdminDashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <EnhancedUserManager />
          </Box>
        </Container>
      </AdminDashboardLayout>
    </AdminRoute>
  );
}