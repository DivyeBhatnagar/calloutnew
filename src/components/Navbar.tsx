'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrophyIcon, MenuIcon, CloseIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMobileMenu();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism-navbar">
        <div className="main-container py-6">
          <div className="flex items-center justify-between">
            {/* Logo - Left side */}
            <Link 
              href="/" 
              className="flex items-center gap-3 hover:scale-105 transition-all duration-300"
            >
              <img 
                src="/Media/Logo/Logo2.png" 
                alt="CALLOUT ESPORTS Logo" 
                className="logo-navbar"
              />
              <span className="navbar-brand-text">CALLOUT ESPORTS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#tournaments" className="nav-link">Tournaments</a>
              <a href="#games" className="nav-link">Games</a>
              <Link href="/about" className="nav-link">About Us</Link>
              {user && <Link href="/dashboard" className="nav-link">Dashboard</Link>}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link href="/dashboard" className="btn-outline-premium">
                    Dashboard
                  </Link>
                  <div className="user-avatar-nav">
                    <img 
                      src={user.photoURL || '/default-avatar.svg'} 
                      alt="Profile"
                      className="nav-avatar"
                    />
                  </div>
                  <button onClick={handleLogout} className="btn-secondary-premium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/authentication/login" className="btn-outline-premium">Login</Link>
                  <Link href="/authentication/register" className="btn-primary-premium">Register</Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button 
              className="hamburger-menu md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button 
          className="mobile-menu-close"
          onClick={closeMobileMenu}
          aria-label="Close mobile menu"
        >
          <CloseIcon size={24} />
        </button>
        
        <div className="mobile-menu-links">
          <a href="#tournaments" className="mobile-menu-link" onClick={closeMobileMenu}>Tournaments</a>
          <a href="#games" className="mobile-menu-link" onClick={closeMobileMenu}>Games</a>
          <Link href="/about" className="mobile-menu-link" onClick={closeMobileMenu}>About Us</Link>
          {user && <Link href="/dashboard" className="mobile-menu-link" onClick={closeMobileMenu}>Dashboard</Link>}
        </div>

        <div className="mobile-menu-auth">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-primary" onClick={closeMobileMenu}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/authentication/login" className="btn-secondary" onClick={closeMobileMenu}>Login</Link>
              <Link href="/authentication/register" className="btn-primary" onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}