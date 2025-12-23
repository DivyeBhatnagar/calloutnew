/**
 * Admin Setup Utility
 * 
 * This file contains utilities to help set up admin users.
 * After users sign up normally via Firebase Auth, use these functions
 * to promote them to admin status.
 * 
 * IMPORTANT: This should only be used by authorized personnel.
 */

import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Admin email addresses that should be promoted to admin
export const ADMIN_EMAILS = [
  'divyebhatnagar784@gmail.com',
  'calloutesports@gmail.com'
];

/**
 * Promote a user to admin status
 * @param {string} uid - User ID from Firebase Auth
 * @param {string} email - User email to verify it's in the admin list
 */
export const promoteToAdmin = async (uid, email) => {
  try {
    // Verify email is in admin list
    if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
      throw new Error(`Email ${email} is not in the authorized admin list`);
    }

    // Get current user data
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error(`User document not found for UID: ${uid}`);
    }

    // Update user role to admin
    await updateDoc(userRef, {
      role: 'admin',
      promotedToAdminAt: new Date().toISOString(),
      promotedBy: 'system'
    });

    console.log(`✅ Successfully promoted ${email} to admin`);
    return true;
  } catch (error) {
    console.error('❌ Error promoting user to admin:', error);
    throw error;
  }
};

/**
 * Check if a user should be an admin based on their email
 * @param {string} email - User email
 */
export const shouldBeAdmin = (email) => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Auto-promote user to admin during signup if they're in the admin list
 * This can be called during the signup process
 * @param {string} uid - User ID
 * @param {string} email - User email
 */
export const autoPromoteIfAdmin = async (uid, email) => {
  if (shouldBeAdmin(email)) {
    try {
      await promoteToAdmin(uid, email);
      console.log(`🔑 Auto-promoted ${email} to admin during signup`);
    } catch (error) {
      console.error('Failed to auto-promote user:', error);
    }
  }
};