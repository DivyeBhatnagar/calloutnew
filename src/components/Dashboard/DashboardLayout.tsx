'use client';

import TopNavbar from './TopNavbar';
import { Box } from '@mui/material';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', background: '#FFFFFF' }}>
      <TopNavbar />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          pt: 10, // Account for fixed navbar height
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}