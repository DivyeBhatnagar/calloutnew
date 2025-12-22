'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../utils/constants';
import LoadingSpinner3D from './LoadingSpinner3D';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireEmailVerification?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireEmailVerification = true 
}: ProtectedRouteProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated
      if (!user) {
        router.push(ROUTES.LOGIN);
        return;
      }

      // Check email verification (skip for Google sign-in users as they're auto-verified)
      if (requireEmailVerification && !user.emailVerified && user.providerData[0]?.providerId === 'password') {
        router.push('/authentication/verify-email');
        return;
      }

      // Check admin access
      if (requireAdmin && !isAdmin()) {
        router.push(ROUTES.DASHBOARD);
        return;
      }
    }
  }, [user, userProfile, loading, requireAdmin, requireEmailVerification, router, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner3D text="Loading..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner3D text="Redirecting to login..." />
      </div>
    );
  }

  // Check email verification for password-based accounts
  if (requireEmailVerification && !user.emailVerified && user.providerData[0]?.providerId === 'password') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner3D text="Email verification required..." />
      </div>
    );
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner3D text="Access denied..." />
      </div>
    );
  }

  return <>{children}</>;
}