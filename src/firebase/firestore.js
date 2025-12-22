'use client';

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
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
    // Remove orderBy to avoid compound index requirement
    const q = query(
      tournamentsRef, 
      where('participants', 'array-contains', uid)
    );
    const querySnapshot = await getDocs(q);
    
    const tournaments = [];
    querySnapshot.forEach((doc) => {
      tournaments.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in JavaScript instead of Firestore to avoid compound index
    return tournaments.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting user tournaments:', error);
    throw error;
  }
};

// Get user tournament registrations
export const getUserRegistrations = async (uid) => {
  try {
    const registrations = [];
    
    // Try to get from user subcollection first
    try {
      const userRegistrationsRef = collection(db, 'users', uid, 'tournament_registrations');
      const userQuerySnapshot = await getDocs(userRegistrationsRef);
      
      userQuerySnapshot.forEach((doc) => {
        registrations.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.log('User subcollection not accessible:', error.message);
    }
    
    // Also get from general registrations collection
    try {
      const generalRegistrationsRef = collection(db, 'registrations');
      const q = query(generalRegistrationsRef, where('userId', '==', uid));
      const generalQuerySnapshot = await getDocs(q);
      
      generalQuerySnapshot.forEach((doc) => {
        // Avoid duplicates by checking if registration already exists
        const existingReg = registrations.find(reg => 
          reg.tournament === doc.data().tournament && 
          reg.game === doc.data().game &&
          reg.college === doc.data().college
        );
        
        if (!existingReg) {
          registrations.push({ id: doc.id, ...doc.data() });
        }
      });
    } catch (error) {
      console.log('General registrations collection not accessible:', error.message);
    }
    
    // Sort by registration date
    return registrations.sort((a, b) => {
      const aTime = a.registeredAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.registeredAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting user registrations:', error);
    throw error;
  }
};

// Query operations
export const getAllQueries = async () => {
  try {
    const queries = [];
    
    // Get from registrations collection (where type = 'query')
    try {
      const registrationsRef = collection(db, 'registrations');
      const querySnapshot = await getDocs(registrationsRef);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'query') {
          queries.push({ id: doc.id, ...data });
        }
      });
      console.log('Found queries in registrations:', queries.length);
    } catch (error) {
      console.log('Registrations collection not accessible:', error.message);
    }
    
    // Also get from queries collection
    try {
      const queriesRef = collection(db, 'queries');
      const querySnapshot = await getDocs(queriesRef);
      
      querySnapshot.forEach((doc) => {
        // Avoid duplicates
        const existingQuery = queries.find(query => 
          query.subject === doc.data().subject && 
          query.email === doc.data().email &&
          Math.abs((query.createdAt?.toDate?.()?.getTime() || 0) - (doc.data().createdAt?.toDate?.()?.getTime() || 0)) < 1000
        );
        
        if (!existingQuery) {
          queries.push({ id: doc.id, ...doc.data() });
        }
      });
      console.log('Total queries found:', queries.length);
    } catch (error) {
      console.log('Queries collection not accessible:', error.message);
    }
    
    // Sort by creation date
    return queries.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting queries:', error);
    throw error;
  }
};

export const getUserQueries = async (uid) => {
  try {
    const queries = [];
    
    // Get from registrations collection (where type = 'query' and userId matches)
    try {
      const registrationsRef = collection(db, 'registrations');
      const querySnapshot = await getDocs(registrationsRef);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === 'query' && data.userId === uid) {
          queries.push({ id: doc.id, ...data });
        }
      });
      console.log('Found user queries in registrations:', queries.length);
    } catch (error) {
      console.log('Registrations collection not accessible:', error.message);
    }
    
    // Also get from user subcollection
    try {
      const userQueriesRef = collection(db, 'users', uid, 'queries');
      const userQuerySnapshot = await getDocs(userQueriesRef);
      
      userQuerySnapshot.forEach((doc) => {
        // Avoid duplicates
        const existingQuery = queries.find(query => 
          query.subject === doc.data().subject && 
          Math.abs((query.createdAt?.toDate?.()?.getTime() || 0) - (doc.data().createdAt?.toDate?.()?.getTime() || 0)) < 1000
        );
        
        if (!existingQuery) {
          queries.push({ id: doc.id, ...doc.data() });
        }
      });
    } catch (error) {
      console.log('User queries subcollection not accessible:', error.message);
    }
    
    // Also get from queries collection
    try {
      const queriesRef = collection(db, 'queries');
      const querySnapshot = await getDocs(queriesRef);
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userId === uid) {
          // Avoid duplicates
          const existingQuery = queries.find(query => 
            query.subject === data.subject && 
            Math.abs((query.createdAt?.toDate?.()?.getTime() || 0) - (data.createdAt?.toDate?.()?.getTime() || 0)) < 1000
          );
          
          if (!existingQuery) {
            queries.push({ id: doc.id, ...data });
          }
        }
      });
      console.log('Total user queries found:', queries.length);
    } catch (error) {
      console.log('Queries collection not accessible:', error.message);
    }
    
    // Sort by creation date
    return queries.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(0);
      const bTime = b.createdAt?.toDate?.() || new Date(0);
      return bTime.getTime() - aTime.getTime();
    });
  } catch (error) {
    console.error('Error getting user queries:', error);
    throw error;
  }
};

export const updateQueryStatus = async (queryId, status, adminReply = null) => {
  try {
    const updateData = {
      status,
      updatedAt: new Date(),
    };
    
    if (adminReply) {
      updateData.adminReply = adminReply;
      updateData.repliedAt = new Date();
    }
    
    // Try to update in queries collection first
    try {
      const queryRef = doc(db, 'queries', queryId);
      await updateDoc(queryRef, updateData);
      console.log('✅ Query updated in queries collection');
      return true;
    } catch (error) {
      console.log('❌ Queries collection update failed:', error.message);
    }
    
    // Try to update in registrations collection
    try {
      const registrationRef = doc(db, 'registrations', queryId);
      await updateDoc(registrationRef, updateData);
      console.log('✅ Query updated in registrations collection');
      return true;
    } catch (error) {
      console.log('❌ Registrations collection update failed:', error.message);
    }
    
    throw new Error('Failed to update query in any collection');
  } catch (error) {
    console.error('Error updating query:', error);
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