# CallOut Esports - Complete Tournament Platform

A comprehensive esports tournament management platform for India's competitive gaming community. Features tournament registration, user management, admin tools, and customer support system.

## 🎯 Platform Overview

**Complete Esports Ecosystem**
- Tournament registration and management
- User dashboard with progress tracking
- Admin panel for data management
- Query/support system for customer service
- Real-time data synchronization with Firebase

## 🚀 Key Features

### 🏆 Tournament System
- **4-Step Registration Flow**: Event Landing → College Selection → Game Selection → Registration Form
- **Supported Games**: BGMI, Free Fire MAX
- **College Integration**: IILM, IIMT, NIET
- **Real-time Registration Tracking**: Instant visibility of tournament registrations
- **Admin Management**: Complete tournament data export and management

### 👤 User Management
- **Firebase Authentication**: Google Sign-In and email/password
- **Complete Profile System**: Editable user profiles with gaming stats
- **Dashboard Analytics**: Tournament participation tracking, rank progression
- **My Queries**: User-specific support ticket tracking

### 🛠️ Admin Tools
- **Registration Data Export**: CSV/JSON export of all tournament data
- **Query Management**: Complete customer support system with reply functionality
- **Real-time Updates**: Live data synchronization across all components

### 💬 Support System
- **Query Submission**: Public contact form for user inquiries
- **Status Tracking**: Pending → Replied → Resolved workflow
- **Admin Replies**: Rich text support for customer service responses
- **Multi-collection Storage**: Robust data storage with fallback mechanisms

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Framework**: Material-UI with custom neomorphic design
- **Backend**: Firebase Firestore with real-time listeners
- **Authentication**: Firebase Auth with Google integration
- **Styling**: Material-UI + Custom CSS with neomorphic design system
- **State Management**: React Context API
- **Deployment**: Vercel-ready

## 🏗️ Project Structure

```
src/
├── app/
│   ├── authentication/          # Login, register, email verification
│   ├── dashboard/              # User dashboard and admin panel
│   │   ├── admin/             # Admin tools and query management
│   │   ├── my-queries/        # User query tracking
│   │   ├── profile/           # User profile management
│   │   ├── settings/          # User preferences
│   │   ├── tournaments/       # Tournament listings
│   │   └── tournament-registration/ # 4-step registration flow
│   ├── query/                 # Public contact/support form
│   └── page.tsx              # Landing page
├── components/
│   ├── Admin/                # Admin-specific components
│   ├── Dashboard/            # Dashboard components
│   ├── Home Page/           # Landing page sections
│   └── TournamentRegistration/ # Registration flow components
├── contexts/
│   └── AuthContext.tsx     # Authentication state management
├── firebase/
│   ├── auth.js             # Authentication functions
│   ├── config.js           # Firebase configuration
│   └── firestore.js        # Database operations
└── utils/                  # Utility functions
```

## 🎮 Tournament Registration Flow

### Step 1: Event Landing
- Tournament information display
- Call-to-action to begin registration

### Step 2: College Selection
- Visual college selection with logos
- Support for IILM, IIMT, NIET

### Step 3: Game Selection
- Choose between BGMI and Free Fire MAX
- Game-specific registration forms

### Step 4: Registration Form
- Auto-filled user information (username, email)
- Team details (name, IGL information)
- Player IDs/UIDs (minimum 4, maximum 5)
- Form validation and submission

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Firebase project with Firestore enabled
- npm or yarn

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd callout-esports
   npm install
   ```

2. **Firebase Setup**
   - Create a Firebase project
   - Enable Firestore Database
   - Enable Authentication (Google + Email/Password)
   - Add your Firebase config to `src/firebase/config.js`

3. **Environment Variables**
   ```bash
   # Create .env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Firestore Security Rules

Essential Firestore rules for the platform (see `QUERY_SYSTEM_FIRESTORE_RULES.md` for complete setup):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow anyone to create registrations/queries
    match /registrations/{registrationId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    
    // Admin access for queries
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

## 🎨 Design System

### Neomorphic Design
- **Background**: White (`#FFFFFF`) with subtle blue gradients
- **Primary Color**: Blue (`#1976d2`)
- **Cards**: Soft shadows with rounded corners
- **Typography**: Clean, modern, gaming-friendly
- **Icons**: 3D vector icons with depth and gradients

### Component Styling
```css
.neomorphic-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.08), 
    -8px -8px 16px rgba(255, 255, 255, 0.9);
  border: 1px solid #f0f0f0;
}
```

## 📊 Data Management

### Collections Structure
- **users**: User profiles and authentication data
- **registrations**: Tournament registrations and queries (with type field)
- **queries**: Dedicated query collection (fallback)
- **tournaments**: Tournament information and metadata

### Real-time Features
- Live tournament registration updates
- Instant query status changes
- Real-time dashboard statistics
- Automatic data synchronization

## 🛡️ Security Features

- **Authentication Required**: Protected routes for dashboard access
- **Data Isolation**: Users can only access their own data
- **Admin Controls**: Separate admin permissions for management features
- **Input Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error management with fallbacks

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Setup
Ensure all Firebase environment variables are configured in your deployment platform.

## 📱 Mobile Responsive

- **Mobile-first Design**: Optimized for all screen sizes
- **Touch-friendly**: Large buttons and touch targets
- **Responsive Navigation**: Collapsible mobile menu
- **Adaptive Layouts**: Cards stack appropriately on mobile

## 🎯 Performance Optimizations

- **Next.js Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Firebase Optimization**: Efficient queries without compound indexes
- **Caching**: Proper caching strategies for static assets

## 📞 Support & Contact

- **Query System**: Built-in support ticket system
- **Email Integration**: Direct Gmail integration for contact
- **Admin Tools**: Complete customer service management
- **Real-time Updates**: Instant notification of new queries

## 📄 License

This project is created for CallOut Esports. All rights reserved.

---

**India's Premier Esports Tournament Platform - Built for Competitive Gaming Excellence**