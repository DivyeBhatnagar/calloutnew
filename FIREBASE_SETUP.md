# Firebase Integration Setup

## ✅ What's Been Done

### 1. Firebase Configuration
- ✅ Added Firebase SDK to dependencies (`firebase@12.7.0`)
- ✅ Created `src/lib/firebase.js` with Firebase initialization
- ✅ Configured environment variables in `.env.local`

### 2. Authentication Context
- ✅ Created `src/contexts/AuthContext.js` with:
  - User authentication state management
  - Sign up, sign in, and logout functions
  - User profile management with Firestore
  - Admin role checking

### 3. Protected Routes
- ✅ Created `src/components/ProtectedRoute.tsx`
- ✅ Dashboard pages are now protected (requires login)
- ✅ Automatic redirect to login page for unauthenticated users

### 4. Authentication Pages
- ✅ Login page: `/auth/login`
- ✅ Register page: `/auth/register`
- ✅ Modern, animated UI with form validation

### 5. UI Integration
- ✅ Updated Navbar to show login/logout buttons
- ✅ Updated Dashboard sidebar to display user info
- ✅ Logout functionality integrated
- ✅ User avatar display from Firebase

## 🔧 Firebase Configuration Required

You need to update `.env.local` with your actual Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### How to Get Firebase Credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app icon (</>)
6. Copy the config values to `.env.local`

## 📋 Firebase Setup Checklist

### In Firebase Console:

1. **Enable Authentication**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password" provider

2. **Create Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Start in production mode (or test mode for development)
   - Choose a location

3. **Set Firestore Rules** (for development):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎮 User Profile Structure

When a user registers, the following profile is created in Firestore:

```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "Gamer Name",
  createdAt: "2024-12-23T...",
  role: "user", // or "admin"
  stats: {
    tournamentsWon: 0,
    winRate: 0,
    totalEarnings: 0,
    currentRank: "Bronze"
  }
}
```

## 🚀 How to Use

### 1. Register a New User
- Navigate to `/auth/register`
- Fill in display name, email, and password
- User will be automatically logged in and redirected to dashboard

### 2. Login
- Navigate to `/auth/login`
- Enter email and password
- Redirected to dashboard on success

### 3. Access Dashboard
- Dashboard is protected - requires authentication
- User info displayed in sidebar
- Logout button available

### 4. Making a User Admin
To make a user an admin, update their Firestore document:
```javascript
// In Firestore Console
users/{userId}
{
  ...
  role: "admin"  // Change from "user" to "admin"
}
```

## 📁 File Structure

```
src/
├── lib/
│   └── firebase.js              # Firebase configuration
├── contexts/
│   └── AuthContext.js           # Authentication context
├── components/
│   ├── ProtectedRoute.tsx       # Route protection
│   ├── Navbar.tsx               # Updated with auth
│   └── Dashboard/
│       └── DashboardLayout.tsx  # Updated with user info
└── app/
    ├── auth/
    │   ├── login/
    │   │   └── page.tsx         # Login page
    │   └── register/
    │       └── page.tsx         # Register page
    └── dashboard/
        └── page.tsx             # Protected dashboard
```

## 🔐 Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use Firebase Security Rules** - Protect your Firestore data
3. **Validate on backend** - Client-side validation is not enough
4. **Use HTTPS in production** - Firebase requires secure connections

## 🎯 Next Steps

1. Update `.env.local` with your Firebase credentials
2. Enable Email/Password authentication in Firebase Console
3. Create Firestore database
4. Test registration and login
5. Customize user profile fields as needed
6. Add more authentication methods (Google, GitHub, etc.)

## 🐛 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Check that all Firebase environment variables are set correctly
- Verify Firebase project exists and is active

### "Missing or insufficient permissions"
- Update Firestore security rules
- Ensure user is authenticated

### "User not redirecting after login"
- Check browser console for errors
- Verify AuthContext is wrapping the app in layout.tsx

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
- [Next.js with Firebase](https://firebase.google.com/docs/web/setup)
