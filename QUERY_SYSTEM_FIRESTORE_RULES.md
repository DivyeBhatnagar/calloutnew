# Query System Firestore Security Rules

## Required Firestore Rules for Query System

Add these rules to your Firestore Security Rules to enable the query system:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Queries collection - Allow users to create queries, admins to read/update
    match /queries/{queryId} {
      // Allow anyone to create queries (for contact form)
      allow create: if true;
      
      // Allow users to read their own queries
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid || 
                      request.auth.token.admin == true);
      
      // Allow admins to update queries (for replies)
      allow update: if request.auth != null && 
                       request.auth.token.admin == true;
    }
    
    // Support collection - Fallback for queries
    match /support/{supportId} {
      allow create: if true;
      allow read, update: if request.auth != null && 
                             request.auth.token.admin == true;
    }
    
    // User subcollection queries
    match /users/{userId}/queries/{queryId} {
      allow create, read: if request.auth != null && 
                             request.auth.uid == userId;
    }
    
    // Existing rules for other collections...
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /registrations/{registrationId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    
    match /tournaments/{tournamentId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Admin Setup

To enable admin access, you need to set custom claims for admin users:

### Using Firebase Admin SDK (Node.js):

```javascript
const admin = require('firebase-admin');

// Set admin claim for a user
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set successfully');
  })
  .catch((error) => {
    console.error('Error setting admin claim:', error);
  });
```

### Using Firebase CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Set custom claims (requires a Cloud Function)
firebase functions:shell
```

## Alternative: Simplified Rules (Less Secure)

If you're having permission issues, you can temporarily use these more permissive rules for testing:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // WARNING: These rules are for development only
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ Important:** Replace with proper security rules before going to production!

## Testing the Query System

1. **Submit a Query**: Go to `/query` and submit a test query
2. **Check Firestore**: Verify the query appears in the `queries` collection
3. **Admin Access**: Go to `/dashboard/admin` and check if queries are visible
4. **User Queries**: Go to `/dashboard/my-queries` to see user-specific queries

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Update Firestore rules as shown above
2. **Admin Can't See Queries**: Set admin custom claims
3. **Queries Not Saving**: Check browser console for specific errors
4. **Local Backup**: If Firestore fails, queries are saved in localStorage as backup

### Debug Steps:

1. Open browser Developer Tools → Console
2. Submit a query and check for error messages
3. Look for specific Firestore error codes
4. Verify your Firestore rules match the examples above

## Production Considerations

1. **Rate Limiting**: Add rate limiting to prevent spam
2. **Email Notifications**: Set up Cloud Functions to email admins about new queries
3. **Data Validation**: Add server-side validation using Cloud Functions
4. **Backup Strategy**: Regular Firestore backups for query data
5. **Analytics**: Track query submission rates and response times