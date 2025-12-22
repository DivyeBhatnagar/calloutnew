# CALLOUT ESPORTS - Project Structure

## 📁 Organized File Structure

### 🔥 Firebase Integration (`src/firebase/`)
```
src/firebase/
├── config.js          # Firebase configuration & initialization
├── auth.js            # Authentication functions (signup, signin, logout)
├── firestore.js       # Firestore database operations
└── index.js           # Centralized exports
```

### 🔐 Authentication Pages (`src/app/authentication/`)
```
src/app/authentication/
├── login/
│   └── page.tsx       # Material UI Login page
├── register/
│   └── page.tsx       # Material UI Register page
└── forgot-password/
    └── page.tsx       # Password reset page
```

### 🎮 Dashboard (`src/app/dashboard/`)
```
src/app/dashboard/
├── page.tsx           # Main dashboard overview
├── tournaments/
│   └── page.tsx       # Tournament browsing page
├── matches/           # (To be created)
├── stats/             # (To be created)
├── profile/           # (To be created)
└── settings/          # (To be created)
```

### 🧩 Components (`src/components/`)
```
src/components/
├── Dashboard/
│   ├── DashboardLayout.tsx    # Main dashboard layout
│   ├── StatsCards.tsx         # Statistics cards
│   ├── RecentTournaments.tsx  # Recent tournaments list
│   ├── UpcomingMatches.tsx    # Upcoming matches
│   ├── PerformanceChart.tsx   # Performance visualization
│   └── QuickActions.tsx       # Quick action buttons
├── Home Page/                 # Homepage components
├── About Us/                  # About page components
├── Navbar.tsx                 # Main navigation
├── Footer.tsx                 # Site footer
├── ProtectedRoute.tsx         # Route protection
├── ThemeProvider.tsx          # Material UI theme
└── icons.tsx                  # Custom icons
```

### 🔧 Configuration & Context (`src/`)
```
src/
├── contexts/
│   └── AuthContext.js         # Authentication state management
├── lib/
│   └── theme.ts              # Material UI theme configuration
└── utils/
    ├── validation.js         # Form validation utilities
    └── constants.js          # Application constants
```

### 🎨 Styling (`src/app/`)
```
src/app/
├── globals.css               # Global styles
├── dashboard.css             # Dashboard-specific styles
└── layout.tsx               # Root layout with providers
```

## 🚀 Key Features by Folder

### Firebase (`src/firebase/`)
- **Centralized Configuration**: Single source for Firebase setup
- **Modular Functions**: Separate files for auth, firestore operations
- **Easy Imports**: Centralized exports via index.js
- **Type Safety**: Proper error handling and validation

### Authentication (`src/app/authentication/`)
- **Material UI Design**: Professional neomorphic styling
- **Complete Flow**: Login, register, password reset
- **Google OAuth**: Integrated Google sign-in
- **Form Validation**: Client-side validation with error handling
- **Responsive Design**: Mobile-first approach

### Dashboard (`src/app/dashboard/`)
- **Protected Routes**: Authentication required
- **Modern UI**: Clean, professional esports design
- **Real-time Data**: Firebase integration for live updates
- **Performance Tracking**: Stats and analytics
- **Tournament Management**: Browse and join tournaments

### Components (`src/components/`)
- **Reusable**: Modular component architecture
- **Consistent Design**: Shared styling and theming
- **Type Safety**: TypeScript for better development experience
- **Responsive**: Mobile and desktop optimized

## 📋 Route Structure

### Public Routes
- `/` - Homepage
- `/about` - About Us page
- `/authentication/login` - Login page
- `/authentication/register` - Register page
- `/authentication/forgot-password` - Password reset

### Protected Routes (Require Authentication)
- `/dashboard` - Main dashboard
- `/dashboard/tournaments` - Tournament browsing
- `/dashboard/matches` - Match scheduling
- `/dashboard/stats` - Performance statistics
- `/dashboard/profile` - User profile management
- `/dashboard/settings` - Account settings

## 🔐 Authentication Flow

1. **Registration**: `/authentication/register`
   - Username, email, password validation
   - Firebase user creation
   - Firestore profile creation
   - Auto-login and redirect to dashboard

2. **Login**: `/authentication/login`
   - Email/password authentication
   - Google OAuth option
   - Remember user session
   - Redirect to dashboard

3. **Password Reset**: `/authentication/forgot-password`
   - Email-based password reset
   - Firebase password reset email
   - Secure token validation

## 🗄️ Database Structure

### Users Collection (`users/{uid}`)
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  username: "GamerName",
  role: "gamer", // or "admin"
  createdAt: "2024-12-23T...",
  stats: {
    tournamentsWon: 0,
    winRate: 0,
    totalEarnings: 0,
    currentRank: "Bronze"
  }
}
```

### Tournaments Collection (`tournaments/{id}`)
```javascript
{
  id: "tournament_id",
  name: "Tournament Name",
  game: "VALORANT",
  status: "Open",
  entryFee: 500,
  prizePool: 50000,
  maxParticipants: 32,
  participants: ["uid1", "uid2"],
  createdAt: "2024-12-23T...",
  startDate: "2024-12-25T...",
  endDate: "2024-12-30T..."
}
```

## 🎯 Development Guidelines

### File Naming
- **Components**: PascalCase (e.g., `DashboardLayout.tsx`)
- **Pages**: lowercase with hyphens (e.g., `forgot-password/`)
- **Utilities**: camelCase (e.g., `validation.js`)
- **Constants**: UPPER_CASE (e.g., `USER_ROLES`)

### Import Structure
```javascript
// External libraries
import { useState } from 'react';
import { Button } from '@mui/material';

// Internal utilities
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../utils/validation';

// Components
import DashboardLayout from '../components/Dashboard/DashboardLayout';
```

### Component Structure
```javascript
'use client'; // For client components

import { /* imports */ } from 'libraries';

interface ComponentProps {
  // TypeScript interface
}

export default function ComponentName({ props }: ComponentProps) {
  // State and hooks
  // Event handlers
  // Effects
  
  return (
    // JSX
  );
}
```

## 🔧 Configuration Files

### Environment Variables (`.env.local`)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Package Dependencies
- **Core**: Next.js 16, React 19, TypeScript
- **UI**: Material UI v5, Emotion, Framer Motion
- **Backend**: Firebase v12 (Auth, Firestore, Analytics)
- **Icons**: Material UI Icons, Lucide React
- **Styling**: Tailwind CSS (existing), Custom CSS

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   - Update `.env.local` with your Firebase credentials
   - Enable Authentication and Firestore in Firebase Console

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Application**:
   - Homepage: `http://localhost:3000`
   - Login: `http://localhost:3000/authentication/login`
   - Dashboard: `http://localhost:3000/dashboard`

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Material UI Documentation](https://mui.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

This organized structure provides a scalable, maintainable codebase for the CALLOUT ESPORTS platform with clear separation of concerns and modern development practices.