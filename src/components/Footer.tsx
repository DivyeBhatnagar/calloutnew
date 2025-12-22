'use client';

import { Box, Container, Grid, Typography, IconButton, Link, Divider } from '@mui/material';
import { 
  Instagram, 
  YouTube, 
  LinkedIn, 
  Email
} from '@mui/icons-material';

// Discord SVG Icon Component
const DiscordIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export default function Footer() {
  const handleEmailClick = () => {
    const email = 'contact@calloutesports.com';
    const subject = 'Contact from CallOut Esports';
    const body = 'Hello CallOut Esports Team,%0A%0AI would like to get in touch regarding:%0A%0A[Please describe your inquiry here]%0A%0AThank you!';
    
    // Always open Gmail web interface
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${body}`, '_blank');
  };

  const quickLinks = [
    { label: 'Tournaments', href: '/dashboard/tournaments' },
    { label: 'Register Tournament', href: '/dashboard/tournament-registration' },
    { label: 'Dashboard', href: '/dashboard' },
    { 
      label: 'Contact', 
      onClick: handleEmailClick
    }
  ];

  const socialLinks = [
    { 
      icon: <DiscordIcon />, 
      label: 'Discord', 
      href: 'https://discord.gg/z5zkHQ9X',
      color: '#5865F2'
    },
    { 
      icon: <Instagram />, 
      label: 'Instagram', 
      href: 'https://www.instagram.com/calloutesports',
      color: '#E4405F'
    },
    { 
      icon: <YouTube />, 
      label: 'YouTube', 
      href: 'https://www.youtube.com/@calloutesports',
      color: '#FF0000'
    },
    { 
      icon: <LinkedIn />, 
      label: 'LinkedIn', 
      href: 'https://www.linkedin.com/company/callout-esports/',
      color: '#0077B5'
    },
    { 
      icon: <Email />, 
      label: 'Email', 
      onClick: handleEmailClick,
      color: '#EA4335'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: '#f8f9fa',
        borderTop: '1px solid #e0e0e0',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Three Column Layout */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* About Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 2, mb: 2 }}>
                <img 
                  src="/Media/Logo/Logo2.png" 
                  alt="CALLOUT ESPORTS Logo" 
                  style={{ height: 40, width: 40 }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#1976d2',
                    letterSpacing: 1,
                  }}
                >
                  CALLOUT ESPORTS
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  lineHeight: 1.6,
                  maxWidth: 300,
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                The premier esports organization powering the next generation of competitive gaming in India.
              </Typography>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1976d2',
                  mb: 2,
                  letterSpacing: 0.5,
                }}
              >
                QUICK LINKS
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {quickLinks.map((link, index) => (
                  link.onClick ? (
                    <Box
                      key={index}
                      component="button"
                      onClick={link.onClick}
                      sx={{
                        color: '#666',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: 14,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: { xs: 'center', md: 'left' },
                        '&:hover': {
                          color: '#1976d2',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.label}
                    </Box>
                  ) : (
                    <Link
                      key={index}
                      href={link.href}
                      target={link.href?.startsWith('http') ? '_blank' : '_self'}
                      rel={link.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                      sx={{
                        color: '#666',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: 14,
                        '&:hover': {
                          color: '#1976d2',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Follow Us Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#1976d2',
                  mb: 2,
                  letterSpacing: 0.5,
                }}
              >
                FOLLOW US
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: 'wrap' }}>
                {socialLinks.map((social, index) => (
                  social.onClick ? (
                    <IconButton
                      key={index}
                      onClick={social.onClick}
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid #1976d2',
                        color: '#1976d2',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: social.color,
                          borderColor: social.color,
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                      title={social.label}
                    >
                      {social.icon}
                    </IconButton>
                  ) : (
                    <IconButton
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        width: 44,
                        height: 44,
                        border: '2px solid #1976d2',
                        color: '#1976d2',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: social.color,
                          borderColor: social.color,
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                      title={social.label}
                    >
                      {social.icon}
                    </IconButton>
                  )
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: '#999',
              fontSize: 13,
            }}
          >
            © 2025 CALLOUT ESPORTS. All rights reserved. India's Competitive Esports Tournament Platform
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}