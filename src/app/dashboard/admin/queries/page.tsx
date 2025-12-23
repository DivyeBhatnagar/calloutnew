'use client';

import AdminRoute from '../../../../components/AdminRoute';
import AdminDashboardLayout from '../../../../components/Admin/AdminDashboardLayout';
import QueryManager from '../../../../components/Admin/QueryManager';
import { Container, Box } from '@mui/material';

export default function AdminQueriesPage() {
  return (
    <AdminRoute>
      <AdminDashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <QueryManager />
          </Box>
        </Container>
      </AdminDashboardLayout>
    </AdminRoute>
  );
}