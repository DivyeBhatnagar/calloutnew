'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase/config';
import { 
  signup as firebaseSignup, 
  signin as firebaseSignin, 
  signInWithGoogle as firebaseSignInWithGoogle,
  logout as firebaseLogout,
  getUserProfile,
  checkEmailVerification,
  resendVerificationEmail
} from '../firebase/auth';

interface UserProfile {
  uid: string;
  email: string;
  username: string;
  role: string;
  emailVerified?: boolean;
  createdAt: string;
  displayName?: string;
  phoneNumber?: string;
  bio?: string;
  favoriteGame?: string;
  discordId?: string;
  photoURL?: string;
  updatedAt?: string;
  promotedToAdminAt?: string;
  stats?: {
    tournamentsWon: number;
    winRate: number;
    totalEarnings: number;
    currentRank: string;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, username: string) => Promise<any>;
  signin: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  getUserProfile: (uid: string) => Promise<any>;
  checkEmailVerification: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Sign up function
  const signup = async (email: string, password: string, username: string) => {
    try {
      const result = await firebaseSignup(email, password, username);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Sign in function
  const signin = async (email: string, password: string) => {
    try {
      const result = await firebaseSignin(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Google sign in function
  const signInWithGoogle = async () => {
    try {
      const result = await firebaseSignInWithGoogle();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const logout = async () => {
    try {
      await firebaseLogout();
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Get user profile from Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile as UserProfile | null);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signup,
    signin,
    signInWithGoogle,
    logout,
    isAdmin,
    getUserProfile,
    checkEmailVerification,
    resendVerificationEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};