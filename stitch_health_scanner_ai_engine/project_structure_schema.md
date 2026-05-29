# Health Scanner AI - Technical Architecture & Schema

## 1. Project Structure (React Native / Flutter)
- `/src`
  - `/assets` (Logos, Jellyfish animation assets)
  - `/components` (Buttons, Cards, Glassmorphic Inputs)
  - `/navigation` (Auth Stack, Main Tab Navigator)
  - `/screens` (Login, Scanner, History, Settings)
  - `/services` (Firebase Auth, Firestore, AI Food Recognition API)
  - `/theme` (Light/Dark mode definitions using Design System tokens)

## 2. Database Schema (Firestore / Supabase)

### `users` Collection
- `uid`: String (Primary Key)
- `email`: String
- `phone_number`: String
- `display_name`: String
- `photo_url`: String
- `settings`: Object { `theme_mode`: 'light' | 'dark', `notifications_enabled`: Boolean }

### `scans` Collection
- `id`: String (Primary Key)
- `user_uid`: String (Foreign Key)
- `food_name`: String
- `timestamp`: Number (ISO Date)
- `nutrients`: Object { `calories`: Number, `protein`: Number, `carbs`: Number, `fats`: Number, `sodium`: Number }
- `verdict`: String ('Excellent' | 'Good' | 'Moderate' | 'Avoid')
- `image_url`: String (Reference to Storage)

## 3. Auth Flows
- **Social**: Firebase/Supabase Auth handles Google & Apple ID handshake.
- **OTP System**: 
  - Phone: Firebase Phone Auth for 6-digit SMS verification.
  - Email: Sendgrid/Postmark triggered by cloud function for 6-digit email OTP.
- **Password Reset**: Apple ID reset flow using `ASAuthorizationAppleIDButton`.
