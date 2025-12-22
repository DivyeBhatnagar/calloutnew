'use client';

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from './config';

// User operations
export const createUser = async (uid, userData) => {
  try {
    await setDoc(doc(db, 'users', uid), userData);
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (uid, userData) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, userData);
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Tournament operations
export const getTournaments = async () => {
  try {
    const tournamentsRef = collection(db, 'tournaments');
    const q = query(tournamentsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const tournaments = [];
    querySnapshot.forEach((doc) => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    
    return tournaments;
  } catch (error) {
    console.error('Error getting tournaments:', error);
    throw error;
  }
};

export const getUserTournaments = async (uid) => {
  try {
    const tournamentsRef = collection(db, 'tournaments');
    const q = query(
      tournamentsRef, 
      where('participants', 'array-contains', uid),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const tournaments = [];
    querySnapshot.forEach((doc) => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    
    return tournaments;
  } catch (error) {
    console.error('Error getting user tournaments:', error);
    throw error;
  }
};

// Match operations
export const getUserMatches = async (uid) => {
  try {
    const matchesRef = collection(db, 'matches');
    const q = query(
      matchesRef, 
      where('participants', 'array-contains', uid),
      orderBy('scheduledAt', 'asc'),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    
    const matches = [];
    querySnapshot.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    
    return matches;
  } catch (error) {
    console.error('Error getting user matches:', error);
    throw error;
  }
};