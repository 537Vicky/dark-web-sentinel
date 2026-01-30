
# Full-Stack Dark Web Monitoring Application

## Overview

This plan outlines the implementation of an enterprise-grade dark web monitoring system with complete authentication, real-time keyword scanning, and alert management. The system will use the existing React/Vite frontend with Lovable Cloud (Supabase) for backend services.

---

## Architecture

```text
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|   React Frontend  |---->|   Lovable Cloud   |---->|   Edge Functions  |
|                   |     |   (Supabase DB)   |     |   (Scan Logic)    |
|                   |     |                   |     |                   |
+-------------------+     +-------------------+     +-------------------+
         |                         |                         |
         v                         v                         v
   - Auth Pages             - Users/Profiles           - Keyword Matching
   - Keyword Input          - Keywords Table           - URL Scanning
   - Dashboard              - Dark Web Sources         - Alert Generation
   - Real-time Alerts       - Monitoring Sessions
                            - Alerts (Real-time)
```

---

## Phase 1: Database Schema Setup

### Tables to Create

| Table | Purpose |
|-------|---------|
| `profiles` | User profile data linked to auth.users |
| `user_roles` | Role-based access control (admin, user) |
| `keywords` | User-submitted keywords to monitor |
| `dark_web_sources` | URLs/sources to scan (pre-seeded) |
| `monitoring_sessions` | Track user monitoring requests |
| `alerts` | Store detected keyword matches |

### Security Features
- Row Level Security (RLS) on all tables
- Users can only access their own data
- Security definer function for role checks
- Trigger for auto-creating profiles on signup

### Seed Data
Pre-populate `dark_web_sources` with mock dark web sources including:
- Dark Forum Alpha (forums)
- Breach Database Market (marketplace)
- Shadow Paste (paste site)
- Underground IRC (irc)
- Leak Archives (database)

---

## Phase 2: Authentication System

### New Pages

1. **Login Page** (`/login`)
   - Email/password form with validation
   - "Forgot password" link
   - Link to register page
   - Error handling with toast notifications

2. **Register Page** (`/register`)
   - Email, password, confirm password fields
   - Input validation using Zod schema
   - Auto-confirm email signup enabled
   - Redirect to dashboard on success

### Auth Components

- **AuthProvider**: Context for managing auth state
- **ProtectedRoute**: Wrapper to guard authenticated routes
- **useAuth Hook**: Access current user and auth methods

### Configuration
- Enable auto-confirm for signups (no email verification required)
- Configure email redirect URL

---

## Phase 3: Home Page with Keyword Input

### Features

1. **Keyword Input Section**
   - Text area for comma-separated keywords
   - Or individual input chips for each keyword
   - Preset keyword types: passwords, emails, phone numbers, credit cards
   - Character validation and sanitization

2. **"Start Monitoring" Button**
   - Validates at least one keyword entered
   - Creates a new monitoring session
   - Triggers edge function to scan sources
   - Redirects to dashboard

3. **Recent Sessions Display**
   - Show user's recent monitoring sessions
   - Quick access to past results

---

## Phase 4: Edge Function for Scanning

### `scan-keywords` Edge Function

```text
Request Flow:
1. Receive keywords + session_id from frontend
2. Fetch all dark_web_sources from database
3. For each source:
   - Simulate content scanning (mock data)
   - Check for keyword matches
   - Generate alerts for matches
4. Insert alerts into database
5. Return summary to frontend
```

### Mock Scanning Logic
Since actual dark web access is not possible, the function will:
- Simulate scanning delays for realism
- Randomly generate matches based on probability
- Assign severity levels (low/medium/high/critical)
- Create realistic mock breach data

---

## Phase 5: Dashboard Page Enhancements

### Real-time Updates
- Subscribe to `alerts` table using Supabase Realtime
- Display new alerts as they arrive
- Visual notification for new critical alerts

### Dashboard Components

1. **Stats Overview**
   - Total keywords monitored
   - Active threats found
   - Sources scanned
   - Last scan time

2. **Live Alert Feed** (enhanced from existing)
   - Pull real alerts from database
   - Filter by severity
   - Filter by keyword type
   - Mark as reviewed/resolved

3. **Keyword Status Panel**
   - List all user keywords
   - Show exposure status per keyword
   - Visual indicators (green = safe, red = exposed)

4. **Recent Sessions**
   - Show monitoring session history
   - Click to view session-specific alerts

---

## Phase 6: Protected Routes & Navigation

### Route Protection
- `/dashboard`, `/monitoring`, `/analytics`, `/reports`, `/settings` require authentication
- Redirect unauthenticated users to `/login`
- Preserve intended destination after login

### Navigation Updates
- Add Login/Logout button to header
- Show user email/name when logged in
- Update sidebar with auth state

---

## Implementation Order

| Step | Task | Dependencies |
|------|------|--------------|
| 1 | Create database schema with RLS | None |
| 2 | Enable auth auto-confirm | Step 1 |
| 3 | Create AuthProvider and useAuth hook | Step 1 |
| 4 | Create Login and Register pages | Step 3 |
| 5 | Create ProtectedRoute component | Step 3 |
| 6 | Update App.tsx with protected routes | Steps 4, 5 |
| 7 | Create Home page with keyword input | Step 1 |
| 8 | Create scan-keywords edge function | Step 1 |
| 9 | Enhance Dashboard with real data | Steps 7, 8 |
| 10 | Add real-time subscriptions | Step 9 |
| 11 | Update navigation and polish UI | All |

---

## Technical Details

### Database Migration SQL

The migration will create:
1. App role enum (admin, user)
2. Profiles table with user_id reference
3. User roles table with RLS
4. Keywords table with user isolation
5. Dark web sources table (admin-seeded)
6. Monitoring sessions table
7. Alerts table with real-time enabled
8. RLS policies for all tables
9. Helper functions for role checks
10. Trigger for auto-creating profiles

### Zod Validation Schemas

```typescript
// Keyword input validation
const keywordSchema = z.object({
  keywords: z.string()
    .min(1, "Enter at least one keyword")
    .max(1000, "Too many characters")
    .transform(val => val.split(',').map(k => k.trim()).filter(Boolean))
});

// Login validation
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password too short")
});
```

### Edge Function Structure

```text
supabase/functions/scan-keywords/
  - index.ts (main handler)
```

Key features:
- JWT validation using getClaims()
- Input sanitization
- Rate limiting considerations
- Proper error handling
- CORS headers

---

## Files to Create/Modify

### New Files
- `src/contexts/AuthContext.tsx` - Auth state management
- `src/hooks/useAuth.ts` - Auth hook
- `src/components/auth/ProtectedRoute.tsx` - Route guard
- `src/pages/Login.tsx` - Login page
- `src/pages/Register.tsx` - Registration page
- `src/pages/Home.tsx` - Keyword input page
- `src/components/keywords/KeywordInput.tsx` - Input component
- `src/components/dashboard/RealAlertFeed.tsx` - Real data alerts
- `src/components/dashboard/KeywordStatus.tsx` - Keyword status panel
- `supabase/functions/scan-keywords/index.ts` - Scan function

### Modified Files
- `src/App.tsx` - Add auth routes and protection
- `src/pages/Dashboard.tsx` - Use real data
- `src/pages/Landing.tsx` - Update CTAs for auth
- `src/components/layout/AppSidebar.tsx` - Add auth state
- `supabase/config.toml` - Add edge function config

---

## Outcome

After implementation, the application will provide:
1. Secure user registration and login
2. Keyword input with validation
3. Simulated dark web source scanning
4. Real-time alert generation and display
5. Per-user data isolation with RLS
6. Professional enterprise UI with animations
7. Fully functional navigation across all pages
