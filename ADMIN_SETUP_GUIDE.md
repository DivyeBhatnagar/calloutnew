# 🔐 Admin Role-Based Access Control Setup Guide

This guide explains how to set up and manage the admin role-based access control system for CALLOUT ESPORTS.

## 🎯 Overview

The system implements secure role-based access control where:
- ✅ Only authorized admin users can access admin features
- ✅ Admin identity is verified via Firestore role field
- ✅ Passwords remain managed by Firebase Auth only
- ✅ Frontend and backend are properly protected
- ✅ No hardcoded credentials anywhere

## 👥 Pre-Authorized Admin Users

The following email addresses are authorized for admin access:

1. **divyebhatnagar784@gmail.com**
2. **calloutesports@gmail.com**

> ⚠️ **Important**: Passwords are NOT stored in the codebase. These users must sign up normally via Firebase Auth, then their role will be automatically set to 'admin' in Firestore.

## 🚀 Setup Process

### Step 1: Deploy Firestore Security Rules

1. Copy the contents of `firestore.rules` to your Firebase Console
2. Go to Firebase Console → Firestore Database → Rules
3. Replace the existing rules with the new ones
4. Click "Publish"

### Step 2: Admin User Registration

For each admin user:

1. **User signs up normally** via the registration page
2. **System automatically detects** if email is in admin list
3. **Role is set to 'admin'** in Firestore during signup
4. **User immediately has admin access** on next login

### Step 3: Manual Admin Promotion (if needed)

If an admin user signed up before this system was implemented:

1. Go to `/dashboard/admin` (as an existing admin)
2. Click on "User Management" tab
3. Find the user with eligible email
4. Click "Promote to Admin"

## 🔒 Security Features

### Frontend Protection

- **Navbar**: Admin links only visible to admin users
- **Routes**: Admin pages redirect non-admin users to dashboard
- **Components**: Admin components check user role before rendering

### Backend Protection

- **Firestore Rules**: Enforce role-based access at database level
- **User Verification**: All admin operations verify user role
- **Audit Trail**: Admin actions are logged with timestamps

### Route Protection Layers

1. **Authentication Check**: User must be logged in
2. **Role Verification**: User role must be 'admin' in Firestore
3. **Real-time Updates**: Role changes take effect immediately
4. **Fallback Protection**: Multiple checks prevent unauthorized access

## 📱 Admin Features

### Admin Dashboard (`/dashboard/admin`)

Accessible only to admin users, provides:

1. **Tournament Registrations**: View and export all tournament data
2. **User Queries**: Manage and respond to user queries
3. **User Management**: View all users and promote eligible ones to admin

### Admin Navigation

- Admin menu items only appear for admin users
- Non-admin users never see admin options
- Clean, role-appropriate UI for all users

## 🛠️ Technical Implementation

### File Structure

```
src/
├── components/
│   ├── AdminRoute.tsx          # Admin route protection
│   └── Admin/
│       ├── AdminUserManager.tsx # User management interface
│       ├── QueryManager.tsx     # Query management
│       └── RegistrationDataExporter.tsx
├── utils/
│   └── adminSetup.js           # Admin utilities
├── firebase/
│   └── auth.js                 # Auto-promotion logic
└── contexts/
    └── AuthContext.tsx         # Role checking functions
```

### Key Functions

- `isAdmin()`: Checks if current user has admin role
- `shouldBeAdmin(email)`: Checks if email is in admin list
- `promoteToAdmin(uid, email)`: Manually promotes user to admin

## 🔍 Verification Steps

### Test Admin Access

1. **Login as admin user**
2. **Check navbar** - should see "Admin" link
3. **Visit `/dashboard/admin`** - should load successfully
4. **Try admin functions** - should work without errors

### Test Non-Admin Access

1. **Login as regular user**
2. **Check navbar** - should NOT see "Admin" link
3. **Try visiting `/dashboard/admin`** - should redirect to dashboard
4. **Check console** - should see access denied messages

## 🚨 Security Best Practices

### ✅ What We Do Right

- No hardcoded passwords or credentials
- Role verification at multiple layers
- Firestore security rules enforce backend protection
- Real-time role checking
- Audit trails for admin actions

### ❌ What We Avoid

- Storing passwords in code or database
- Relying only on frontend checks
- Using email matching without role verification
- Exposing admin features to non-admin users

## 🔧 Troubleshooting

### Admin User Can't Access Admin Features

1. Check user's role in Firestore: `users/{uid}.role`
2. Verify email is in `ADMIN_EMAILS` list
3. Try logging out and back in
4. Check browser console for errors

### Regular User Sees Admin Links

1. Check if user was accidentally promoted to admin
2. Verify `isAdmin()` function is working correctly
3. Clear browser cache and reload

### Firestore Permission Errors

1. Verify security rules are deployed correctly
2. Check that user document exists in Firestore
3. Ensure user role field is set correctly

## 📞 Support

If you encounter issues with the admin system:

1. Check the browser console for error messages
2. Verify Firestore security rules are deployed
3. Ensure admin users are properly registered
4. Contact the development team with specific error details

---

## 🎉 System Status

✅ **Role-Based Access Control**: Implemented  
✅ **Frontend Protection**: Active  
✅ **Backend Security Rules**: Deployed  
✅ **Auto Admin Promotion**: Working  
✅ **Manual Admin Management**: Available  
✅ **Audit Logging**: Enabled  

The admin system is now fully operational and secure! 🔐