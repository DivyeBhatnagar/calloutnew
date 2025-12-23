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
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp,
} from '@mui/icons-material';

export default function TopNavbar() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, userProfile, logout, isAdmin } = useAuth();
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

  // Base navigation links for all users
  const baseNavigationLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Register Tournament', href: '/dashboard/tournament-registration' },
    { label: 'Tournaments', href: '/dashboard/tournaments' },
    { label: 'My Queries', href: '/dashboard/my-queries' },
    { label: 'Profile', href: '/dashboard/profile' },
  ];

  // Add admin link only for admin users
  const navigationLinks = isAdmin() 
    ? [...baseNavigationLinks, { label: 'Admin', href: '/dashboard/admin' }]
    : baseNavigationLinks;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: '#FFFFFF',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
          {/* Left: Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img
                src="/Media/Logo/Logo2.png"
                alt="CALLOUT ESPORTS"
                style={{ height: 32, width: 32 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#1976d2',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                CALLOUT ESPORTS
              </Typography>
            </Box>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navigationLinks.map((link) => (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  color: '#666',
                  fontWeight: 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    background: '#f5f5f5',
                    color: '#1976d2',
                  },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Right: User Profile & Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { xs: 'block', md: 'none' } }}
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
              {user?.displayName || userProfile?.username || 'User'}
            </Typography>

            {/* Profile Avatar & Menu */}
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
              <Avatar
                src={user?.photoURL || '/default-avatar.svg'}
                sx={{
                  width: 36,
                  height: 36,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
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
            width: 250,
            background: '#FFFFFF',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
            Menu
          </Typography>
          <List>
            {navigationLinks.map((link) => (
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
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}