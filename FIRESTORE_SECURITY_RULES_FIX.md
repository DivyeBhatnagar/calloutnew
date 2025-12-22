# Firestore Security Rules Fix for Tournament Registration

## Problem
You're getting "Permission denied" error when trying to register for tournaments because Firestore security rules don't allow writes to the registration collections.

## Solution - Update Firestore Security Rules

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **call-out-esports**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top

### Step 2: Update the Security Rules

Replace your current rules with these updated rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
      
      // Subcollection for tournament registrations under user
      match /tournament_registrations/{registrationId} {
        allow read: if isAuthenticated();
        allow write: if isOwner(userId);
      }
    }
    
    // Tournament registrations collection - authenticated users can write
    match /registrations/{registrationId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Alternative collection name
    match /tournament_registrations/{registrationId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Tournaments collection - read for all authenticated users
    match /tournaments/{tournamentId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins should write (set up admin rules separately)
    }
    
    // Matches collection
    match /matches/{matchId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins should write
    }
    
    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Publish the Rules
1. After pasting the rules, click the **Publish** button
2. Wait for the confirmation message "Rules published successfully"

### Step 4: Test the Registration
1. Go back to your app
2. Make sure you're logged in
3. Try registering for the tournament again
4. It should now work!

## What These Rules Do

### ✅ Allow authenticated users to:
- Read and write their own user documents
- Create tournament registrations with their own userId
- Read and update their own registrations
- Read tournament and match data

### ❌ Prevent:
- Unauthenticated access
- Users from modifying other users' data
- Users from creating registrations with someone else's userId
- Direct writes to tournaments and matches (admin only)

## Alternative: Test Mode (NOT RECOMMENDED FOR PRODUCTION)

If you want to quickly test without security (ONLY for development), you can temporarily use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2025, 2, 1);
    }
  }
}
```

**⚠️ WARNING:** This allows anyone to read/write all data until February 1, 2025. Only use for testing!

## Troubleshooting

### Still getting permission denied?
1. **Check if you're logged in**: Open browser console and check for authentication errors
2. **Clear browser cache**: Sometimes old rules are cached
3. **Wait 1-2 minutes**: Rule changes can take a moment to propagate
4. **Check the userId**: Make sure the registration payload includes the correct userId

### How to verify rules are working:
1. Open browser console (F12)
2. Look for console.log messages showing which save method succeeded
3. You should see: "✅ Registration saved to user subcollection" or similar

## Need More Help?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your Firebase project ID matches: `call-out-esports`
3. Make sure your user is authenticated (check AuthContext)
4. Try logging out and logging back in