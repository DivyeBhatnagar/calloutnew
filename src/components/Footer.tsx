'use client';

import { motion } from 'framer-motion';
import { Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

// Discord SVG Icon Component
const DiscordIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

export default function Footer() {
  const quickLinks = [
    { label: 'Tournaments', href: '#' },
    { label: 'Games', href: '#' },
    { label: 'Creators', href: '#' },
    { label: 'Contact', href: 'mailto:contact@calloutesports.com' }
  ];

  const socialLinks = [
    { icon: <DiscordIcon />, label: 'Discord', href: 'https://discord.gg/z5zkHQ9X' },
    { icon: <Instagram className="w-5 h-5" />, label: 'Instagram', href: 'https://www.instagram.com/calloutesports' },
    { icon: <Youtube className="w-5 h-5" />, label: 'YouTube', href: 'https://www.youtube.com/@calloutesports' },
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', href: 'https://www.linkedin.com/company/callout-esports/' },
    { icon: <Mail className="w-5 h-5" />, label: 'Email', href: 'mailto:contact@calloutesports.com' }
  ];

  return (
    <footer className="section-spacing border-t border-gray-200" style={{backgroundColor: '#f0f4ff'}}>
      <div className="main-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 max-w-6xl mx-auto">
            {/* About Column */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <img 
                  src="/Media/Logo/Logo2.png" 
                  alt="CALLOUT ESPORTS Logo" 
                  className="logo-footer"
                />
              </div>
              <h3 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-4">CALLOUT ESPORTS</h3>
              <p className="text-gray-600 leading-relaxed">
                The premier esports organization powering the next generation of competitive gaming in India.
              </p>
            </motion.div>

            {/* Quick Links Column */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-6">QUICK LINKS</h3>
              <ul className="space-y-4">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Follow Us Column */}
            <motion.div
              className="text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-bold text-blue-600 uppercase tracking-wide mb-6">FOLLOW US</h3>
              <div className="flex gap-4 justify-center md:justify-start">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            className="text-center pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500">
              © 2025 CALLOUT ESPORTS. All rights reserved. India's Competitive BGMI Tournament Platform
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}