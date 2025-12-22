# Google Authentication Troubleshooting Guide

## 🔍 Common Issues & Solutions

### 1. **Domain Authorization Issue**
**Error**: `auth/unauthorized-domain`

**Solution**: Add your domain to Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Authentication → Settings
3. Scroll to "Authorized domains"
4. Add these domains:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - Your production domain (e.g., `yourdomain.com`)

### 2. **Popup Blocked**
**Error**: `auth/popup-blocked` or `auth/popup-closed-by-user`

**Solutions**:
- Allow popups in browser settings
- Use redirect method instead of popup
- Check browser extensions blocking popups

### 3. **OAuth Client Configuration**
**Error**: `auth/invalid-api-key` or OAuth errors

**Solution**: Verify Google Cloud Console settings
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project → APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Add authorized origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Add authorized redirect URIs:
   - `http://localhost:3000/__/auth/handler` (development)
   - `https://yourdomain.com/__/auth/handler` (production)

### 4. **Environment Variables**
**Error**: Configuration not found

**Check `.env.local`**:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. **Browser Console Errors**
Open browser DevTools (F12) and check for:
- Network errors
- CORS issues
- JavaScript errors
- Firebase configuration errors

## 🛠️ Testing Steps

### 1. **Test Firebase Configuration**
```javascript
// Add this to your login page temporarily
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
```

### 2. **Test Google Provider**
```javascript
// Check if Google provider is configured
console.log('Google Provider:', googleProvider);
```

### 3. **Test Network Connection**
- Check if you can access `https://accounts.google.com`
- Verify internet connection
- Check firewall/proxy settings

## 🔧 Alternative Solutions

### Use Redirect Instead of Popup
If popups are consistently blocked, use redirect method:

```javascript
// In your login component
import { signInWithGoogleRedirect } from '../../../firebase/auth';

const handleGoogleSignInRedirect = async () => {
  try {
    await signInWithGoogleRedirect();
    // User will be redirected to Google, then back to your app
  } catch (error) {
    console.error('Redirect sign-in failed:', error);
  }
};
```

### Handle Redirect Result
Add this to your main layout or app component:

```javascript
import { handleGoogleRedirectResult } from '../firebase/auth';

useEffect(() => {
  // Handle redirect result when app loads
  handleGoogleRedirectResult().catch(console.error);
}, []);
```

## 📋 Checklist

Before testing Google Sign-In, ensure:

- [ ] Firebase project is created and configured
- [ ] Google Authentication is enabled in Firebase Console
- [ ] OAuth 2.0 Client ID is created in Google Cloud Console
- [ ] Authorized domains are added in Firebase
- [ ] Authorized origins are added in Google Cloud Console
- [ ] Environment variables are correctly set
- [ ] Browser allows popups for your domain
- [ ] No ad blockers or extensions interfering
- [ ] Internet connection is stable

## 🚨 Emergency Fallback

If Google Sign-In continues to fail, users can:
1. Use email/password registration instead
2. Contact support with error details
3. Try different browser or incognito mode
4. Clear browser cache and cookies

## 📞 Getting Help

If issues persist:
1. Check browser console for specific error codes
2. Test in different browsers (Chrome, Firefox, Safari)
3. Test in incognito/private mode
4. Verify all Firebase and Google Cloud settings
5. Check Firebase project billing status
6. Review Firebase Authentication usage limits

## 🔍 Debug Information

When reporting issues, include:
- Browser and version
- Operating system
- Exact error message
- Browser console logs
- Network tab information
- Firebase project ID (without sensitive data)

This comprehensive troubleshooting should resolve most Google Authentication issues!