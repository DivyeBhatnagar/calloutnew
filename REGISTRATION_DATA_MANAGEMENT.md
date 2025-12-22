# Tournament Registration Data Management Guide

## 📊 **Where Registration Data is Stored**

### **Firestore Database Locations**

Your tournament registration data is saved in **3 different locations** for maximum reliability:

#### **1. Primary Location: User Subcollections**
```
/users/{userId}/tournament_registrations/campus_showdown_2024
```
- **Best for**: Individual user data access
- **Security**: Users can only access their own data

#### **2. Backup Location: General Registrations Collection**
```
/registrations/{userId}_campus_showdown_2024
```
- **Best for**: Admin access to all registrations
- **Security**: Admin-level access required

#### **3. Fallback Location: User Document Merge**
```
/users/{userId}
```
- **Field**: `tournament_registration`
- **Best for**: Emergency backup if other methods fail

## 🔽 **How to Access & Download Data**

### **Method 1: Admin Dashboard (Recommended)**

1. **Navigate to Admin Page**: `/dashboard/admin`
2. **Click "Load Registrations"** to fetch all data
3. **Download Options**:
   - **CSV Format**: For Excel/Google Sheets
   - **JSON Format**: For developers/technical use

### **Method 2: Firebase Console (Manual)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `call-out-esports`
3. Click **Firestore Database**
4. Navigate to collections:
   - `/registrations` - Main collection
   - `/users/{userId}/tournament_registrations` - User subcollections

### **Method 3: Programmatic Access**

Use the functions in your admin dashboard or create custom queries:

```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';

// Get all registrations
const fetchAllRegistrations = async () => {
  const registrationsRef = collection(db, 'registrations');
  const snapshot = await getDocs(registrationsRef);
  
  const registrations = [];
  snapshot.forEach(doc => {
    registrations.push({ id: doc.id, ...doc.data() });
  });
  
  return registrations;
};
```

## 📋 **Data Structure**

Each registration contains:

```json
{
  "id": "userId_campus_showdown_2024",
  "tournament": "Campus Showdown",
  "college": "IILM|IIMT|NIET",
  "game": "BGMI|FREE_FIRE_MAX",
  "username": "User's display name",
  "email": "user@example.com",
  "userId": "Firebase Auth UID",
  "phoneNumber": "1234567890",
  "teamName": "Team Name",
  "iglName": "In-Game Leader Name",
  "iglContact": "1234567890",
  "playerIds": ["player1", "player2", "player3", "player4", "player5?"],
  "playerCount": 4,
  "registeredAt": "2024-12-23T10:30:00Z",
  "status": "registered",
  "createdAt": "2024-12-23T10:30:00Z",
  "updatedAt": "2024-12-23T10:30:00Z"
}
```

## 📈 **Data Analysis & Reports**

### **Key Metrics You Can Extract:**

1. **Total Registrations**: Count of all registrations
2. **College Distribution**: Registrations per college
3. **Game Popularity**: BGMI vs Free Fire MAX registrations
4. **Registration Timeline**: Registrations over time
5. **Team Sizes**: Distribution of team sizes (4-5 players)

### **Sample Queries for Analysis:**

```javascript
// Count by college
const collegeStats = registrations.reduce((acc, reg) => {
  acc[reg.college] = (acc[reg.college] || 0) + 1;
  return acc;
}, {});

// Count by game
const gameStats = registrations.reduce((acc, reg) => {
  acc[reg.game] = (acc[reg.game] || 0) + 1;
  return acc;
}, {});

// Average team size
const avgTeamSize = registrations.reduce((sum, reg) => 
  sum + reg.playerCount, 0) / registrations.length;
```

## 🔐 **Security & Permissions**

### **Required Firestore Rules for Admin Access:**

```javascript
// Add this to your Firestore rules for admin access
match /registrations/{registrationId} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
}

// For admin users (add admin field to user document)
match /registrations/{registrationId} {
  allow read, write: if isAuthenticated() && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

### **Admin User Setup:**

To give yourself admin access, update your user document:

```javascript
// In Firestore console, add to your user document:
{
  "role": "admin",
  "permissions": ["read_registrations", "export_data"]
}
```

## 📤 **Export Formats**

### **CSV Export Includes:**
- Registration ID
- Tournament Name
- College
- Game
- Username & Email
- Contact Information
- Team Details
- Player IDs
- Registration Date
- Status

### **JSON Export Includes:**
- Complete raw data
- All metadata
- Timestamps
- Nested arrays (player IDs)

## 🔧 **Troubleshooting**

### **No Data Showing?**
1. Check Firestore security rules
2. Verify you're logged in as admin
3. Check browser console for errors
4. Ensure registrations exist in database

### **Permission Denied?**
1. Update Firestore rules to allow admin access
2. Add admin role to your user document
3. Clear browser cache and retry

### **Export Not Working?**
1. Check if data loaded successfully
2. Verify browser allows file downloads
3. Try different export format (CSV vs JSON)

## 📞 **Support**

If you need help with data access or export:
1. Check the browser console for detailed error messages
2. Verify your Firebase project permissions
3. Ensure you have the latest Firestore security rules
4. Contact your Firebase project administrator

## 🚀 **Next Steps**

Consider implementing:
1. **Real-time dashboard** with live registration counts
2. **Email notifications** for new registrations
3. **Automated reports** sent daily/weekly
4. **Registration approval workflow**
5. **Tournament bracket generation** from registration data