// Firebase configuration and initialization
export { auth, googleProvider, db, analytics } from './config';

// Authentication functions
export { 
  signup, 
  signin, 
  signInWithGoogle,
  signInWithGoogleRedirect,
  handleGoogleRedirectResult,
  logout, 
  resetPassword, 
  getUserProfile,
  checkEmailVerification,
  resendVerificationEmail
} from './auth';

// Firestore functions
export { 
  createUser, 
  getUser, 
  updateUser, 
  getTournaments, 
  getUserTournaments, 
  getUserMatches 
} from './firestore';