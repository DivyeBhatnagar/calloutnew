import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

/**
 * Delete all registrations for a specific user email
 * @param {string} userEmail - The email of the user whose registrations should be deleted
 */
export async function deleteUserRegistrations(userEmail) {
  try {
    console.log(`Starting deletion process for user: ${userEmail}`);
    
    // Query registrations collection for the specific user email
    const registrationsRef = collection(db, 'registrations');
    const q = query(registrationsRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No registrations found for user: ${userEmail}`);
      return { success: true, deletedCount: 0, message: 'No registrations found' };
    }
    
    console.log(`Found ${querySnapshot.size} registrations for user: ${userEmail}`);
    
    // Delete each registration document
    const deletePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      const registrationData = docSnapshot.data();
      console.log(`Deleting registration: ${docSnapshot.id} - Tournament: ${registrationData.tournamentName || 'Unknown'}`);
      deletePromises.push(deleteDoc(doc(db, 'registrations', docSnapshot.id)));
    });
    
    // Execute all deletions
    await Promise.all(deletePromises);
    
    console.log(`Successfully deleted ${querySnapshot.size} registrations for user: ${userEmail}`);
    
    return {
      success: true,
      deletedCount: querySnapshot.size,
      message: `Successfully deleted ${querySnapshot.size} registrations`
    };
    
  } catch (error) {
    console.error('Error deleting user registrations:', error);
    return {
      success: false,
      deletedCount: 0,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Delete all queries for a specific user email
 * @param {string} userEmail - The email of the user whose queries should be deleted
 */
export async function deleteUserQueries(userEmail) {
  try {
    console.log(`Starting query deletion process for user: ${userEmail}`);
    
    // Query queries collection for the specific user email
    const queriesRef = collection(db, 'queries');
    const q = query(queriesRef, where('email', '==', userEmail));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log(`No queries found for user: ${userEmail}`);
      return { success: true, deletedCount: 0, message: 'No queries found' };
    }
    
    console.log(`Found ${querySnapshot.size} queries for user: ${userEmail}`);
    
    // Delete each query document
    const deletePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      const queryData = docSnapshot.data();
      console.log(`Deleting query: ${docSnapshot.id} - Subject: ${queryData.subject || 'Unknown'}`);
      deletePromises.push(deleteDoc(doc(db, 'queries', docSnapshot.id)));
    });
    
    // Execute all deletions
    await Promise.all(deletePromises);
    
    console.log(`Successfully deleted ${querySnapshot.size} queries for user: ${userEmail}`);
    
    return {
      success: true,
      deletedCount: querySnapshot.size,
      message: `Successfully deleted ${querySnapshot.size} queries`
    };
    
  } catch (error) {
    console.error('Error deleting user queries:', error);
    return {
      success: false,
      deletedCount: 0,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Delete all data (registrations and queries) for a specific user email
 * @param {string} userEmail - The email of the user whose data should be deleted
 */
export async function deleteAllUserData(userEmail) {
  try {
    console.log(`Starting complete data deletion for user: ${userEmail}`);
    
    const registrationResult = await deleteUserRegistrations(userEmail);
    const queryResult = await deleteUserQueries(userEmail);
    
    const totalDeleted = registrationResult.deletedCount + queryResult.deletedCount;
    
    return {
      success: registrationResult.success && queryResult.success,
      registrations: registrationResult,
      queries: queryResult,
      totalDeleted,
      message: `Deleted ${registrationResult.deletedCount} registrations and ${queryResult.deletedCount} queries (${totalDeleted} total)`
    };
    
  } catch (error) {
    console.error('Error deleting all user data:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}