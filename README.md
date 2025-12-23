# CallOut Esports - Complete Tournament Platform

A comprehensive esports tournament management platform for India's competitive gaming community. Built with Next.js 16, React 19, and Firebase, featuring tournament registration, user management, admin tools, and customer support system.

## 🎯 Platform Overview

**Complete Esports Ecosystem for Competitive Gaming**
- Multi-step tournament registration system
- Real-time user dashboard with analytics
- Comprehensive admin panel for data management
- Integrated query/support system
- Real-time data synchronization with Firebase
- Mobile-responsive design with neomorphic UI

## 🚀 Complete Feature Set

### 🏆 Tournament Management System
- **Dynamic Tournament Creation**: Admin-controlled tournament setup with custom configurations
- **4-Step Registration Flow**: 
  - Event Landing Page with tournament details
  - College Selection (IILM, IIMT, NIET)
  - Game Selection (BGMI, Free Fire MAX, COD, Valorant)
  - Registration Form with team details and player IDs
- **Slot Management**: Configurable tournament slots with auto-close when full
- **Progress Tracking**: Real-time registration progress bars and visual indicators
- **Tournament Status**: Live tracking of available slots and registration counts
- **Registration Export**: CSV/JSON export of all tournament data for admins

### � User Autohentication & Profiles
- **Multi-Auth Support**: 
  - Google Sign-In integration
  - Email/password authentication
  - Email verification system
  - Password reset functionality
- **Complete Profile System**: 
  - Editable user profiles with gaming stats
  - Profile pictures and personal information
  - Gaming achievements and tournament history
  - Rank progression tracking (Bronze → Silver → Gold → Diamond)
- **User Dashboard**: 
  - Tournament participation analytics
  - Performance metrics and win rates
  - Recent activity feed
  - Quick action buttons for common tasks

### 🎮 Gaming Features
- **Multi-Game Support**: BGMI, Free Fire MAX, Call of Duty, Valorant
- **Game-Specific Registration**: Tailored forms for different games
- **Player ID Management**: Support for various gaming platform IDs
- **Team Management**: Team creation with IGL (In-Game Leader) designation
- **Match Tracking**: Upcoming matches and tournament schedules

### 🛠️ Admin Panel & Tools
- **Comprehensive Admin Dashboard**: 
  - Real-time analytics and statistics
  - User management and role assignment
  - Tournament creation and management tools
  - Registration data visualization
- **Tournament Management**: 
  - Create/edit/delete tournaments
  - Set tournament slots and configurations
  - Monitor registration progress
  - Export participant data
- **User Management**: 
  - View all registered users
  - Manage user roles and permissions
  - Delete user accounts and data
  - Track user activity and statistics
- **Query Management System**: 
  - View all customer support queries
  - Reply to user inquiries
  - Update query status (Pending → Replied → Resolved)
  - Rich text editor for admin responses

### 💬 Customer Support System
- **Public Query Form**: Contact form accessible without login
- **Multi-Channel Storage**: Queries stored in multiple Firestore collections for reliability
- **Status Tracking**: Complete workflow from submission to resolution
- **User Query Dashboard**: Users can track their submitted queries
- **Admin Response System**: Rich text replies with email notifications
- **Query Categories**: Organized support tickets by type and priority

### 📊 Analytics & Reporting
- **Real-Time Dashboard**: Live statistics and performance metrics
- **Tournament Analytics**: Registration trends and participation data
- **User Engagement**: Activity tracking and user behavior analysis
- **Performance Metrics**: Win rates, tournament completion, and rankings
- **Export Capabilities**: Data export in multiple formats (CSV, JSON)

### 🎨 UI/UX Features
- **Neomorphic Design**: Modern 3D-style interface with soft shadows
- **Mobile-First Responsive**: Optimized for all screen sizes
- **3D Icons & Animations**: Interactive 3D elements using Three.js
- **Loading Animations**: Smooth 3D loading spinners and transitions
- **Dark/Light Theme**: Adaptive theming with Material-UI
- **Accessibility**: WCAG compliant design with keyboard navigation

### 🔐 Security & Data Management
- **Firebase Security Rules**: Comprehensive Firestore security configuration
- **Role-Based Access**: Admin and user role separation
- **Data Validation**: Client and server-side input validation
- **Error Handling**: Comprehensive error management with fallbacks
- **Data Backup**: Multi-collection storage for critical data
- **Privacy Protection**: User data isolation and protection

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Framework**: Material-UI with custom neomorphic design
- **3D Graphics**: Three.js with React Three Fiber
- **Animations**: Framer Motion for smooth transitions
- **Backend**: Firebase Firestore with real-time listeners
- **Authentication**: Firebase Auth with Google integration
- **Storage**: Firebase Storage for media files
- **Analytics**: Firebase Analytics for user tracking
- **Styling**: Material-UI + Tailwind CSS with custom neomorphic design
- **State Management**: React Context API
- **Icons**: Lucide React + Material-UI Icons
- **Deployment**: Vercel-ready with optimized builds

## 🏗️ Project Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── authentication/        # Auth pages (login, register, verify)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── verify-email/
│   ├── dashboard/             # Protected user dashboard
│   │   ├── admin/            # Admin-only pages
│   │   ├── my-queries/       # User query tracking
│   │   ├── profile/          # User profile management
│   │   ├── settings/         # User preferences
│   │   ├── tournaments/      # Tournament listings
│   │   └── tournament-registration/ # 4-step registration
│   ├── about/                # About us page
│   ├── games/                # Games showcase
│   ├── query/                # Public contact form
│   └── page.tsx              # Landing page
├── components/
│   ├── Admin/                # Admin panel components
│   │   ├── AdminDashboardLayout.tsx
│   │   ├── TournamentManager.tsx
│   │   ├── RegistrationManager.tsx
│   │   ├── QueryManager.tsx
│   │   ├── UserDataDeleter.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── Dashboard/            # User dashboard components
│   │   ├── DashboardLayout.tsx
│   │   ├── StatsCards.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── RecentActivityFeed.tsx
│   │   └── QuickActions.tsx
│   ├── Home Page/           # Landing page sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── TournamentSection.tsx
│   │   └── CTASection.tsx
│   ├── About Us/            # About page components
│   │   ├── AboutHeroSection.tsx
│   │   ├── VisionMissionSection.tsx
│   │   └── FounderSection.tsx
│   ├── TournamentRegistration/ # Registration flow
│   │   ├── EventLandingStep.tsx
│   │   ├── CollegeSelectionStep.tsx
│   │   ├── GameSelectionStep.tsx
│   │   ├── RegistrationFormStep.tsx
│   │   └── SuccessStep.tsx
│   ├── Tournaments/         # Tournament components
│   └── Common/              # Shared components
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       ├── LoadingSpinner3D.tsx
│       └── Icon3D.tsx
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── firebase/
│   ├── config.js           # Firebase configuration
│   ├── auth.js             # Authentication functions
│   └── firestore.js        # Database operations
├── utils/                  # Utility functions
└── lib/                    # Helper libraries
```

## 🎮 Tournament Registration Flow

### Step 1: Event Landing
- Tournament information and rules display
- Prize pool and tournament format details
- Call-to-action to begin registration
- Tournament status and available slots

### Step 2: College Selection
- Visual college selection with institutional logos
- Support for IILM, IIMT, NIET with expansion capability
- College-specific tournament eligibility
- Dynamic college loading from database

### Step 3: Game Selection
- Choose between supported games (BGMI, Free Fire MAX, COD, Valorant)
- Game-specific tournament formats
- Dynamic game loading with custom registration forms
- Game artwork and description display

### Step 4: Registration Form
- Auto-filled user information (username, email)
- Team details (team name, IGL designation)
- Player IDs/UIDs (minimum 4, maximum 5 players)
- Contact information and emergency details
- Form validation and real-time error checking
- Submission confirmation and receipt generation

### Step 5: Success Confirmation
- Registration confirmation with unique ID
- Tournament details and next steps
- Calendar integration for tournament dates
- Social sharing options

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Firebase project with Firestore enabled
- npm or yarn package manager

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd callout-esports
   npm install
   ```

2. **Firebase Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Enable Authentication (Google + Email/Password)
   - Enable Storage for file uploads
   - Enable Analytics (optional)
   - Copy your Firebase config

3. **Environment Variables**
   Create `.env.local` in the root directory:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Firestore Security Rules**
   Add these rules to your Firestore Security Rules:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Anyone can create registrations/queries
       match /registrations/{registrationId} {
         allow create: if true;
         allow read: if request.auth != null;
       }
       
       // Tournaments are publicly readable, admin writable
       match /tournaments/{tournamentId} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.token.admin == true;
       }
       
       // Queries system
       match /queries/{queryId} {
         allow create: if true;
         allow read: if request.auth != null && 
                        (resource.data.userId == request.auth.uid || 
                         request.auth.token.admin == true);
         allow update: if request.auth != null && 
                          request.auth.token.admin == true;
       }
     }
   }
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Setup

To create admin users, you need to set custom claims in Firebase:

### Using Firebase Admin SDK:
```javascript
const admin = require('firebase-admin');

// Set admin claim for a user
admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => console.log('Admin claim set successfully'))
  .catch(error => console.error('Error:', error));
```

### Auto-Admin Setup:
The system includes automatic admin promotion for specific email addresses. Edit `src/utils/adminSetup.js` to add admin emails.

## 🎨 Design System & UI Components

### Neomorphic Design Philosophy
- **Background**: Clean white (#FFFFFF) with subtle gradients
- **Primary Colors**: Blue (#1976d2) with accent variations
- **Card Design**: Soft inset/outset shadows for 3D depth effect
- **Typography**: Modern, gaming-friendly font hierarchy
- **Interactive Elements**: Hover states with depth transitions

### Component Styling Examples
```css
/* Neomorphic Card Style */
.neomorphic-card {
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.08), 
    -8px -8px 16px rgba(255, 255, 255, 0.9);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

/* Interactive Button */
.neomorphic-button {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 
    5px 5px 10px rgba(0, 0, 0, 0.1),
    -5px -5px 10px rgba(255, 255, 255, 0.9);
}

.neomorphic-button:hover {
  box-shadow: 
    inset 5px 5px 10px rgba(0, 0, 0, 0.1),
    inset -5px -5px 10px rgba(255, 255, 255, 0.9);
}
```

### 3D Elements & Animations
- **Three.js Integration**: Interactive 3D icons and loading animations
- **Framer Motion**: Smooth page transitions and micro-interactions
- **Loading States**: 3D spinning elements with gaming aesthetics
- **Hover Effects**: Depth-based interactions for better UX

## � Dapta Architecture & Collections

### Firestore Collections Structure
```javascript
// Users Collection
users/{userId} {
  uid: string,
  email: string,
  username: string,
  role: 'admin' | 'gamer',
  emailVerified: boolean,
  createdAt: timestamp,
  photoURL: string,
  stats: {
    tournamentsWon: number,
    winRate: number,
    totalEarnings: number,
    currentRank: string
  }
}

// Tournaments Collection
tournaments/{tournamentId} {
  name: string,
  game: string,
  college: string,
  maxSlots: number,
  currentRegistrations: number,
  status: 'open' | 'closed' | 'completed',
  prizePool: number,
  startDate: timestamp,
  endDate: timestamp,
  rules: string[],
  createdAt: timestamp
}

// Registrations Collection
registrations/{registrationId} {
  userId: string,
  tournament: string,
  game: string,
  college: string,
  teamName: string,
  igl: string,
  playerIds: string[],
  contactInfo: object,
  registeredAt: timestamp,
  status: 'pending' | 'confirmed' | 'cancelled'
}

// Queries Collection
queries/{queryId} {
  userId: string,
  name: string,
  email: string,
  subject: string,
  message: string,
  status: 'pending' | 'replied' | 'resolved',
  adminReply: string,
  createdAt: timestamp,
  repliedAt: timestamp
}
```

### Real-time Data Features
- **Live Registration Counts**: Real-time tournament slot tracking
- **Instant Query Updates**: Live status changes for support tickets
- **Dashboard Analytics**: Real-time user statistics and performance
- **Tournament Progress**: Live progress bars and participant counts

## 🛡️ Security & Performance

### Security Features
- **Authentication Required**: Protected routes with role-based access
- **Data Isolation**: Users can only access their own data
- **Admin Controls**: Separate admin permissions with custom claims
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized user inputs and secure data handling
- **CSRF Protection**: Firebase security rules prevent unauthorized access

### Performance Optimizations
- **Next.js Optimizations**: 
  - Automatic code splitting
  - Image optimization
  - Static generation where possible
  - Server-side rendering for SEO
- **Firebase Optimizations**: 
  - Efficient queries without compound indexes
  - Real-time listeners with proper cleanup
  - Optimistic UI updates
- **Caching Strategies**: 
  - Browser caching for static assets
  - Firebase caching for frequently accessed data
  - Component-level memoization

## 📱 Mobile Responsiveness

### Mobile-First Design
- **Responsive Breakpoints**: Tailored for mobile, tablet, and desktop
- **Touch-Friendly Interface**: Large buttons and touch targets (44px minimum)
- **Adaptive Navigation**: Collapsible mobile menu with smooth animations
- **Optimized Forms**: Mobile-friendly form inputs and validation
- **Performance**: Optimized for mobile networks and devices

### Cross-Platform Compatibility
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **PWA Ready**: Service worker support for offline functionality
- **Responsive Images**: Automatic image optimization for different screen sizes

## 🚀 Deployment & Production

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard
# or use Vercel CLI
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
```

### Alternative Deployment Options
- **Netlify**: Static site deployment with serverless functions
- **Firebase Hosting**: Native Firebase integration
- **AWS Amplify**: Full-stack deployment with CI/CD
- **Docker**: Containerized deployment for any platform

### Production Checklist
- [ ] Environment variables configured
- [ ] Firebase security rules updated
- [ ] Admin users configured with custom claims
- [ ] Analytics and monitoring set up
- [ ] Error tracking implemented (Sentry recommended)
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented
- [ ] SSL certificate configured
- [ ] Domain configured and DNS updated

## 🔧 Development & Maintenance

### Development Scripts
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npm run type-check
```

### Code Quality Tools
- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Type safety and better developer experience
- **Prettier**: Code formatting (configure in your editor)
- **Husky**: Git hooks for pre-commit checks (optional)

### Monitoring & Analytics
- **Firebase Analytics**: User behavior and engagement tracking
- **Performance Monitoring**: Page load times and user experience
- **Error Tracking**: Real-time error monitoring and alerts
- **User Feedback**: Built-in query system for user support

## 📞 Support & Contact

### Built-in Support System
- **Query Submission**: `/query` - Public contact form
- **User Queries**: `/dashboard/my-queries` - Track submitted queries
- **Admin Management**: `/dashboard/admin` - Manage all queries
- **Status Tracking**: Real-time query status updates

### Technical Support
- **Documentation**: Comprehensive README and inline code comments
- **Error Handling**: Detailed error messages and fallback mechanisms
- **Debugging**: Console logging and error tracking
- **Community**: GitHub issues for bug reports and feature requests

## 📄 License & Credits

### License
This project is created for CallOut Esports. All rights reserved.

### Technologies Used
- **Next.js** - React framework for production
- **Material-UI** - React component library
- **Firebase** - Backend-as-a-Service platform
- **Three.js** - 3D graphics library
- **Framer Motion** - Animation library
- **TypeScript** - Type-safe JavaScript

### Media Assets
- Game logos and artwork used under fair use
- College logos used with permission
- Custom 3D icons and animations
- Background images and graphics

---

**🎮 India's Premier Esports Tournament Platform - Built for Competitive Gaming Excellence 🏆**

*Empowering the next generation of esports athletes with cutting-edge technology and seamless tournament management.*