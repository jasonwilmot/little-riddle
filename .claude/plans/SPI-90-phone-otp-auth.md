# SPI-90: Phone OTP Authentication via Supabase

**Overall Progress:** `100%`

## TLDR
Add phone-based OTP authentication using Supabase Auth. Users sign up/log in from the Profile page via a sheet flow (phone → OTP → username for new users). First auth infrastructure in the app — enables future sharing/sync features. Includes Supabase `users` table SQL, RLS policies, and PhoneNumberKit for international phone input.

## Critical Decisions
- **PhoneNumberKit** via SPM for country code picker + E.164 validation — saves time vs custom picker, handles international formatting
- **Single sheet with step progression** — cleaner UX than multiple sheets, keeps flow contained
- **AuthService as @Observable singleton** — injected via SwiftUI environment, readable from all pages, consistent with existing PlayerViewModel pattern
- **`.xcconfig` → `Info.plist`** for API keys — industry standard, App Store safe for client-side anon keys
- **Username validated on submit only** — simpler, avoids real-time API calls while typing
- **Supabase `users` table** — SQL provided for manual setup (no auto-create trigger; username is captured in-app)

## Tasks:

- [x] 🟩 **Step 1: Supabase SQL Setup (manual)**
  - [x] 🟩 Provide SQL for `users` table (`id` UUID FK → `auth.users`, `username` text unique, `phone` text, `created_at` timestamptz)
  - [x] 🟩 Provide RLS policies (users can read/insert/update own row only)
  - [x] 🟩 SQL file at `Scripts/supabase_setup.sql` — run manually in Supabase SQL Editor

- [x] 🟩 **Step 2: Add SPM Dependencies**
  - [x] 🟩 Add `supabase-swift` SDK via Swift Package Manager (resolved v2.40.0)
  - [x] 🟩 Add `PhoneNumberKit` via Swift Package Manager (resolved v4.2.3)

- [x] 🟩 **Step 3: Supabase Configuration & Key Storage**
  - [x] 🟩 Create `Supabase.xcconfig` with `SUPABASE_URL` and `SUPABASE_ANON_KEY`
  - [x] 🟩 Add config keys to `Info.plist` via `$(SUPABASE_URL)` / `$(SUPABASE_ANON_KEY)`
  - [x] 🟩 `.gitignore` already had `*.xcconfig` excluded
  - [x] 🟩 Create `Supabase.xcconfig.template` with placeholder values for other devs

- [x] 🟩 **Step 4: AuthService**
  - [x] 🟩 Create `PodRadio/Services/Auth/AuthService.swift`
  - [x] 🟩 `@Observable`, `@MainActor` singleton (consistent with existing services)
  - [x] 🟩 Initialize Supabase client reading keys from `Info.plist`
  - [x] 🟩 Properties: `isAuthenticated`, `currentUsername`, `isLoading`, `errorMessage`
  - [x] 🟩 Methods: `sendOTP(phone:)`, `verifyOTP(phone:code:)`, `checkIsNewUser()`, `createUsername(_:)`, `fetchUsername()`, `logout()`
  - [x] 🟩 Session restoration on app launch (Supabase SDK handles persistence, we just read state)
  - [x] 🟩 Username uniqueness check via Supabase unique constraint + error parsing

- [x] 🟩 **Step 5: Phone Login Sheet UI**
  - [x] 🟩 Create `PodRadio/Views/Auth/PhoneLoginView.swift` — sheet container with step-based navigation
  - [x] 🟩 **Step 1 — Phone Input**: PhoneNumberKit country picker (default US), phone text field, "Send Code" button, inline error display
  - [x] 🟩 **Step 2 — OTP Entry**: 6-digit code input, "Verify" button, "Resend Code" button with 30s cooldown timer, inline error display
  - [x] 🟩 **Step 3 — Username Setup** (new users only): text field with alphanumeric validation (max 20 chars, no spaces), "Continue" button, inline "username taken" error
  - [x] 🟩 Loading states on all action buttons
  - [x] 🟩 Dismiss sheet on completion

- [x] 🟩 **Step 6: Profile Page Updates**
  - [x] 🟩 Update `ProfileView.swift` — logged-out state: prompt text + "Log In" button that presents `PhoneLoginView` as sheet
  - [x] 🟩 Logged-in state: "Logged in as [username]" + subtext about sharing + "Log Out" button
  - [x] 🟩 Logout clears session via `AuthService.logout()`, immediately shows logged-out UI

- [x] 🟩 **Step 7: Environment Injection**
  - [x] 🟩 Initialize `AuthService` in `StumbleCastApp.swift` alongside existing services
  - [x] 🟩 Inject into SwiftUI environment so all views can read auth state
  - [x] 🟩 Restore session on app launch

## Files Created
- `PodRadio/Services/Auth/AuthService.swift`
- `PodRadio/Views/Auth/PhoneLoginView.swift`
- `Scripts/supabase_setup.sql`
- `Supabase.xcconfig`
- `Supabase.xcconfig.template`

## Files Modified
- `PodRadio/Views/Profile/ProfileView.swift`
- `PodRadio/App/StumbleCastApp.swift`
- `PodRadio/Info.plist`
- `project.yml` (SPM dependencies + xcconfig reference)

## Build Status
- **BUILD SUCCEEDED** (iPhone 17 Pro Simulator, iOS 26.2)

## Out of Scope
- Data sync tied to auth state
- Any feature gating based on login status
- Sign in with Apple / email auth
- Account deletion (future requirement for App Store)
