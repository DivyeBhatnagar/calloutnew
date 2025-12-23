'use client';

import AdminRoute from '../../../../components/AdminRoute';
import AdminDashboardLayout from '../../../../components/Admin/AdminDashboardLayout';
import AnalyticsDashboard from '../../../../components/Admin/AnalyticsDashboard';
import { Container, Box } from '@mui/material';

export default function AdminAnalyticsPage() {
  return (
    <AdminRoute>
      <AdminDashboardLayout>
        <Container maxWidth="xl">
          <Box sx={{ py: 4 }}>
            <AnalyticsDashboard />
          </Box>
        </Container>
      </AdminDashboardLayout>
    </AdminRoute>
  );
}