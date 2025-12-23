'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp,
  Dashboard,
  EmojiEvents,
  People,
  ContactSupport,
  Analytics,
  Home,
} from '@mui/icons-material';
import Footer from '../Footer';

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const router = useRouter();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/authentication/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleMenuClose();
  };

  // Admin-specific navigation links
  const adminNavigationLinks = [
    { label: 'Admin Dashboard', href: '/dashboard/admin', icon: <Dashboard /> },
    { label: 'Tournaments', href: '/dashboard/admin/tournaments', icon: <EmojiEvents /> },
    { label: 'Registrations', href: '/dashboard/admin/registrations', icon: <People /> },
    { label: 'User Management', href: '/dashboard/admin/users', icon: <People /> },
    { label: 'Queries', href: '/dashboard/admin/queries', icon: <ContactSupport /> },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: <Analytics /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="fixed"
        sx={{
          background: '#FFFFFF',
          boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          {/* Left: Admin Logo */}
          <Link href="/dashboard/admin" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src="/Media/Logo/Logo2.png"
                alt="CALLOUT ESPORTS"
                style={{ height: 32, width: 32 }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#1976d2',
                    display: { xs: 'none', sm: 'block' },
                    lineHeight: 1,
                  }}
                >
                  CALLOUT ESPORTS
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    display: { xs: 'none', sm: 'block' },
                    fontWeight: 500,
                  }}
                >
                  Admin Dashboard
                </Typography>
              </Box>
            </Box>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
            {adminNavigationLinks.slice(0, 4).map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                startIcon={link.icon}
                sx={{
                  color: '#666',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  background: '#FFFFFF',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.08), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                  border: '1px solid #f0f0f0',
                  mx: 0.5,
                  '&:hover': {
                    background: '#f8f9fa',
                    color: '#1976d2',
                    boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.12), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Right: User Profile & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Back to User Dashboard */}
            <Button
              component={Link}
              href="/dashboard"
              startIcon={<Home />}
              sx={{
                color: '#666',
                fontWeight: 500,
                px: 2,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                background: '#FFFFFF',
                boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.08), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                border: '1px solid #e0e0e0',
                display: { xs: 'none', md: 'flex' },
                '&:hover': {
                  background: '#f8f9fa',
                  color: '#1976d2',
                  boxShadow: '6px 6px 12px rgba(0, 0, 0, 0.12), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              User Dashboard
            </Button>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ 
                display: { xs: 'block', lg: 'none' },
                color: '#666'
              }}
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* User Name (Desktop) */}
            <Typography
              variant="body2"
              sx={{
                color: '#333',
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {user?.displayName || userProfile?.username || 'Admin'}
            </Typography>

            {/* Profile Avatar & Menu */}
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar
                src={user?.photoURL || '/default-avatar.svg'}
                sx={{
                  width: 36,
                  height: 36,
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                  border: '2px solid #f0f0f0',
                }}
              />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                '& .MuiPaper-root': {
                  borderRadius: 2,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  mt: 1,
                },
              }}
            >
              <MenuItem onClick={handleMenuClose} component={Link} href="/dashboard/profile">
                <AccountCircle sx={{ mr: 2 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 2 }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: '#FFFFFF',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
            Admin Menu
          </Typography>
          <List>
            {adminNavigationLinks.map((link) => (
              <ListItem
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  '&:hover': { background: '#f5f5f5' },
                }}
              >
                <ListItemIcon sx={{ color: '#1976d2' }}>
                  {link.icon}
                </ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
            <Divider sx={{ my: 2 }} />
            <ListItem
              component={Link}
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': { background: '#f5f5f5' },
              }}
            >
              <ListItemIcon sx={{ color: '#666' }}>
                <Home />
              </ListItemIcon>
              <ListItemText primary="User Dashboard" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          pt: 10, // Account for fixed navbar height
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
          flex: 1,
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}