# Tournament Registration Flow

## Overview
A comprehensive 4-step tournament registration system for the Campus Showdown esports tournament, seamlessly integrated with the existing CallOut Esports platform.

## Features

### 🔐 Authentication Required
- Only authenticated users can access the registration flow
- Auto-fills user information from Firebase Auth
- Prevents duplicate registrations

### 📱 Responsive Design
- Mobile-friendly interface
- Consistent with existing UI design system
- Neomorphic card styling with soft shadows

### 🎯 4-Step Registration Process

#### Step 1: Event Landing Page
- Welcome screen with tournament branding
- Large "Campus Showdown" title
- Event logo placeholder
- Single "Continue" button to proceed

#### Step 2: College Selection
- Grid layout of college cards
- Supported colleges:
  - IILM University
  - IIMT University  
  - NIET College
- Visual selection with blue border and check icon
- Hover effects with elevation
- Continue button enabled only after selection

#### Step 3: Game Selection
- Two game options available:
  - BGMI (Battle Royale Championship)
  - Free Fire MAX (Ultimate Battle Arena)
- Large game cards with logos and descriptions
- Auto-navigation after selection
- Smooth transition animations

#### Step 4: Registration Form
- **Auto-filled fields (read-only):**
  - Username (from Firebase Auth)
  - Email (from Firebase Auth)
- **Required user input:**
  - Phone Number (10 digits)
  - Team Name
  - IGL (In-Game Leader) Name
  - IGL Contact Number (10 digits)
  - Player IDs/UIDs (minimum 4, maximum 5)
- **Game-specific fields:**
  - BGMI: Player IDs
  - Free Fire MAX: Player UIDs
- Form validation with real-time feedback
- Submit button disabled until all required fields are valid

#### Step 5: Success Confirmation
- Success animation with checkmark
- Registration details summary
- Action buttons to navigate to Dashboard or Tournaments

## Technical Implementation

### File Structure
```
src/
├── app/dashboard/tournament-registration/
│   └── page.tsx                    # Main registration page
├── components/TournamentRegistration/
│   ├── EventLandingStep.tsx        # Step 1: Event intro
│   ├── CollegeSelectionStep.tsx    # Step 2: College selection
│   ├── GameSelectionStep.tsx       # Step 3: Game selection
│   ├── RegistrationFormStep.tsx    # Step 4: Registration form
│   ├── SuccessStep.tsx            # Step 5: Success confirmation
│   ├── StepIndicator.tsx          # Progress indicator
│   └── index.ts                   # Export barrel
```

### Data Storage
- Registration data stored in Firestore collection: `tournament_registrations`
- Includes user ID, timestamp, and all form data
- Prevents duplicate submissions

### Navigation Integration
- Added "Register Tournament" link to dashboard navbar
- Updated "Join Tournament" button to redirect to registration flow
- Breadcrumb navigation with step indicator

### Validation Rules
- Phone numbers must be exactly 10 digits
- Minimum 4 players required (5th is optional substitute)
- All required fields must be filled
- Real-time form validation feedback

## Design System Compliance

### Colors
- Primary: Blue (#1976d2)
- Background: White (#FFFFFF)
- Text: Dark gray (#1a1a1a, #666)
- Success: Green (#4caf50)

### Typography
- Headers: Bold, clean fonts
- Body text: Regular weight, good readability
- Gaming-friendly but professional

### Components
- Neomorphic cards with soft shadows
- Rounded corners (borderRadius: 3-4)
- Hover effects with elevation changes
- Blue accent colors for interactive elements

### Icons
- Material-UI icons throughout
- 3D-style visual elements
- Consistent sizing and spacing

## Usage

### For Users
1. Log in to your CallOut Esports account
2. Navigate to Dashboard
3. Click "Register Tournament" in navbar or "Join Tournament" button
4. Follow the 4-step registration process
5. Receive confirmation upon successful registration

### For Developers
- All components are TypeScript-enabled
- Responsive design using Material-UI Grid system
- State management with React hooks
- Firebase integration for data persistence
- Error handling and loading states included

## Future Enhancements
- Email confirmation system
- Tournament bracket generation
- Team management features
- Payment integration for paid tournaments
- Advanced validation rules
- Multi-tournament support