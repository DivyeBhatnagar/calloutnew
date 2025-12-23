'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner3D from './LoadingSpinner3D';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute Component
 * 
 * This component ensures that only authenticated admin users can access
 * admin-only routes. It provides multiple layers of protection:
 * 
 * 1. Checks if user is authenticated
 * 2. Checks if user has admin role in Firestore
 * 3. Redirects non-admin users to dashboard
 * 4. Shows loading states during verification
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, userProfile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // First check: User must be authenticated
      if (!user) {
        console.log('🚫 Admin route access denied: User not authenticated');
        router.push('/authentication/login');
        return;
      }

      // Second check: User must have admin role
      if (!isAdmin()) {
        console.log('🚫 Admin route access denied: User is not admin');
        console.log('User role:', userProfile?.role);
        router.push('/dashboard');
        return;
      }

      // Success: User is authenticated and is admin
      console.log('✅ Admin route access granted for:', user.email);
    }
  }, [user, userProfile, loading, isAdmin, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner3D text="Verifying admin access..." />
      </div>
    );
  }

  // Show loading while redirecting non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner3D text="Authentication required..." />
      </div>
    );
  }

  // Show access denied for non-admin users
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render admin content for authorized users
  return <>{children}</>;
}