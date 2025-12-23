'use client';

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './config';
import { shouldBeAdmin } from '../utils/adminSetup';

// Sign up function with email verification
export const signup = async (email, password, username) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(result.user, {
      displayName: username
    });

    // Send email verification
    await sendEmailVerification(result.user, {
      url: `${window.location.origin}/authentication/verify-email`,
      handleCodeInApp: true,
    });

    // Create user profile in Firestore (but mark as unverified)
    const userRole = shouldBeAdmin(email) ? 'admin' : 'gamer';
    
    await setDoc(doc(db, 'users', result.user.uid), {
      uid: result.user.uid,
      email: email,
      username: username,
      role: userRole,
      emailVerified: false,
      createdAt: new Date().toISOString(),
      stats: {
        tournamentsWon: 0,
        winRate: 0,
        totalEarnings: 0,
        currentRank: 'Bronze'
      }
    });

    // Log admin promotion if applicable
    if (userRole === 'admin') {
      console.log(`🔑 User ${email} automatically promoted to admin during signup`);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Sign in function
export const signin = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    throw error;
  }
};

// Google sign in function
export const signInWithGoogle = async () => {
  try {
    console.log('Starting Google Sign-In...');
    
    // Sign in with popup
    const result = await signInWithPopup(auth, googleProvider);
    console.log('Google Sign-In successful:', result.user.email);
    
    // Check if user document exists, if not create it
    const userDocRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      console.log('Creating new user document...');
      const userRole = shouldBeAdmin(result.user.email) ? 'admin' : 'gamer';
      
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        username: result.user.displayName || result.user.email.split('@')[0],
        role: userRole,
        createdAt: new Date().toISOString(),
        photoURL: result.user.photoURL || null,
        stats: {
          tournamentsWon: 0,
          winRate: 0,
          totalEarnings: 0,
          currentRank: 'Bronze'
        }
      };
      
      await setDoc(userDocRef, userData);
      console.log('User document created successfully');
      
      // Log admin promotion if applicable
      if (userRole === 'admin') {
        console.log(`🔑 User ${result.user.email} automatically promoted to admin during Google signup`);
      }
    } else {
      console.log('User document already exists');
    }

    return result;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    
    // Provide more specific error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in popup was closed. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by browser. Please allow popups for this site.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error('This domain is not authorized for Google Sign-In. Please contact support.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another sign-in popup is already open.');
    } else {
      throw error;
    }
  }
};

// Sign out function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Password reset function
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Google sign in with redirect (alternative method)
export const signInWithGoogleRedirect = async () => {
  try {
    console.log('Starting Google Sign-In with redirect...');
    await signInWithRedirect(auth, googleProvider);
    // The result will be handled by getRedirectResult in the auth state listener
  } catch (error) {
    console.error('Google Sign-In Redirect Error:', error);
    throw error;
  }
};

// Handle redirect result (call this on app initialization)
export const handleGoogleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log('Google Sign-In redirect successful:', result.user.email);
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log('Creating new user document from redirect...');
        const userRole = shouldBeAdmin(result.user.email) ? 'admin' : 'gamer';
        
        const userData = {
          uid: result.user.uid,
          email: result.user.email,
          username: result.user.displayName || result.user.email.split('@')[0],
          role: userRole,
          createdAt: new Date().toISOString(),
          photoURL: result.user.photoURL || null,
          stats: {
            tournamentsWon: 0,
            winRate: 0,
            totalEarnings: 0,
            currentRank: 'Bronze'
          }
        };
        
        await setDoc(userDocRef, userData);
        console.log('User document created successfully from redirect');
        
        // Log admin promotion if applicable
        if (userRole === 'admin') {
          console.log(`🔑 User ${result.user.email} automatically promoted to admin during redirect signup`);
        }
      }
      
      return result;
    }
    return null;
  } catch (error) {
    console.error('Handle redirect result error:', error);
    throw error;
  }
};
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Check email verification and update profile
export const checkEmailVerification = async () => {
  try {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      
      if (auth.currentUser.emailVerified) {
        // Update Firestore profile to mark as verified
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          emailVerified: true,
          verifiedAt: new Date().toISOString()
        });
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
};

// Resend verification email
export const resendVerificationEmail = async () => {
  try {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/authentication/verify-email`,
        handleCodeInApp: true,
      });
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};