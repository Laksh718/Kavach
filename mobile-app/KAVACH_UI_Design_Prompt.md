# KAVACH — Complete Mobile App UI/UX Design Specification
**Version 1.0 · March 2026 · For Designers, Developers & AI Tools**
**Stack:** React Native 0.73 + TypeScript + Expo (bare) + React Navigation v6 + Zustand + React Query + Hermes enabled

> Hand this document verbatim to Figma AI, v0, Cursor, Framer AI, or any design/code tool. It contains every screen, every component, every pixel decision needed to build the KAVACH mobile app exactly matching the reference design system.

---

## PART 1: DESIGN SYSTEM & VISUAL LANGUAGE

### 1.1 Design Philosophy
**"Trustworthy simplicity for workers who don't trust insurance."**

The visual language must feel like a premium fintech app (think Zepto, PhonePe, or Paytm Money) — not a government scheme, not a corporate insurance portal. Every screen communicates: "Your money is safe. This is automatic. You don't need to do anything."

The reference aesthetic (from provided images) is:
- **Warm cream/off-white backgrounds** — not harsh white (#FFFFFF), but soft warm white
- **Royal blue as the primary action color** — confident, trustworthy
- **Black as the secondary strong color** — for emphasis, numbers, key data
- **Light blue tints** — for cards, backgrounds, accent areas
- **Rounded everything** — pill buttons, rounded cards, circular icons
- **Bold oversized numbers** — earnings, payouts, amounts are always hero-sized
- **Clean list rows** with avatar/icon on left, info in center, value right-aligned

---

### 1.2 Color Tokens

```
/* === KAVACH DESIGN TOKENS === */

/* Primary Brand */
--kavach-blue-primary:    #1A56DB  /* Royal Blue — main CTAs, active states */
--kavach-blue-light:      #E8F3FF  /* Light Blue — card backgrounds, tints */
--kavach-blue-mid:        #B8D4F8  /* Mid Blue — sidebar bg, inactive areas */
--kavach-blue-deep:       #0C3780  /* Deep Blue — hover states on primary */

/* Neutrals */
--kavach-bg-warm:         #F6F4F0  /* Warm White — all screen backgrounds */
--kavach-bg-card:         #FFFFFF  /* Pure White — card surfaces */
--kavach-black:           #111827  /* Near Black — primary text, action buttons */
--kavach-gray-dark:       #374151  /* Dark Gray — secondary text */
--kavach-gray-mid:        #6B7280  /* Mid Gray — labels, captions */
--kavach-gray-light:      #E5E7EB  /* Light Gray — dividers, borders */
--kavach-gray-faint:      #F9FAFB  /* Faint Gray — input backgrounds */

/* Semantic */
--kavach-green:           #15803D  /* Success — payout received, active policy */
--kavach-green-light:     #DCFCE7  /* Success tint — success backgrounds */
--kavach-amber:           #B45309  /* Warning — disruption active, AQI moderate */
--kavach-amber-light:     #FEF3C7  /* Warning tint */
--kavach-red:             #B91C1C  /* Danger — policy lapsed, severe disruption */
--kavach-red-light:       #FEE2E2  /* Danger tint */
--kavach-orange:          #C2410C  /* Disruption alert orange */
--kavach-orange-light:    #FFEDD5  /* Disruption tint */

/* Zone Safety Colors */
--zone-5:                 #15803D  /* 5 shields — very safe (green) */
--zone-4:                 #65A30D  /* 4 shields — safe (lime) */
--zone-3:                 #B45309  /* 3 shields — moderate (amber) */
--zone-2:                 #C2410C  /* 2 shields — risky (orange) */
--zone-1:                 #B91C1C  /* 1 shield — high risk (red) */

/* TrustKarma Tier Colors */
--karma-base:             #6B7280  /* Gray */
--karma-silver:           #9CA3AF  /* Silver */
--karma-gold:             #D97706  /* Gold */
--karma-platinum:         #1A56DB  /* Blue/Platinum */
--karma-champion:         #7C3AED  /* Purple/Champion */
```

---

### 1.3 Typography Scale

```
/* Font Family: "DM Sans" (primary) + "DM Mono" (numbers/amounts) */
/* Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI' */

/* Display — Hero amounts, big payouts */
--text-display:     font-size: 40px; font-weight: 800; letter-spacing: -1.5px; font-family: 'DM Mono'

/* Headline 1 — Screen titles */
--text-h1:          font-size: 28px; font-weight: 700; letter-spacing: -0.5px

/* Headline 2 — Section titles */
--text-h2:          font-size: 22px; font-weight: 700; letter-spacing: -0.3px

/* Headline 3 — Card titles, names */
--text-h3:          font-size: 18px; font-weight: 600; letter-spacing: -0.2px

/* Body Large — Primary body text */
--text-body-lg:     font-size: 16px; font-weight: 400; line-height: 1.6

/* Body — Standard body */
--text-body:        font-size: 14px; font-weight: 400; line-height: 1.5

/* Label — Tags, badges, chips */
--text-label:       font-size: 12px; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase

/* Caption — Timestamps, footnotes */
--text-caption:     font-size: 11px; font-weight: 400; color: --kavach-gray-mid

/* Number Large — Key earnings/amounts (DM Mono) */
--text-number-lg:   font-size: 32px; font-weight: 800; font-family: 'DM Mono'; letter-spacing: -1px

/* Number Med — Supporting amounts */
--text-number-md:   font-size: 22px; font-weight: 700; font-family: 'DM Mono'
```

---

### 1.4 Spacing System
```
4px  — xs    (tight gaps between inline elements)
8px  — sm    (gap between label and value)
12px — md    (gap between list items)
16px — lg    (internal card padding)
20px — xl    (screen horizontal padding — consistent across ALL screens)
24px — 2xl   (gap between sections)
32px — 3xl   (gap between major blocks)
40px — 4xl   (top padding after status bar)
```

---

### 1.5 Component Library

#### A. Primary CTA Button
```
Background: --kavach-blue-primary (#1A56DB)
Text: White, 16px, font-weight: 700
Height: 56px
Border-radius: 28px (fully pill-shaped)
Width: 100% (full width within screen padding)
Shadow: none
Active state: scale(0.97) + darken to --kavach-blue-deep
Disabled state: background #B8D4F8, text #6B7280
```

#### B. Secondary Button
```
Background: --kavach-blue-light (#E8F3FF)
Text: --kavach-blue-primary, 16px, font-weight: 600
Height: 56px
Border-radius: 28px (pill)
Width: 100%
```

#### C. Ghost/Outline Button
```
Background: transparent
Border: 1.5px solid --kavach-gray-light
Text: --kavach-black, 16px, font-weight: 600
Height: 56px
Border-radius: 28px
```

#### D. Pill Toggle (Two Options)
```
Container: background #E8F3FF, border-radius: 28px, padding: 4px
Active pill: background --kavach-blue-primary, text white, border-radius: 24px
Inactive pill: transparent text --kavach-gray-mid
Height of container: 44px
Each pill: flex: 1, centered text
```

#### E. Circular Action Button (like reference Image 2)
```
Size: 52px × 52px
Shape: perfect circle (border-radius: 50%)
Active/default: background --kavach-black, icon white
Secondary variant: background --kavach-blue-light, icon --kavach-blue-primary
Icon size inside: 20px
Label below button: 11px, --kavach-gray-mid, 6px gap
```

#### F. Card (Standard)
```
Background: #FFFFFF
Border-radius: 20px
Padding: 20px
Border: 1px solid #F0EEE8 (very subtle warm border)
No box-shadow (flat design per reference)
```

#### G. Card (Tinted/Featured)
```
Background: --kavach-blue-light (#E8F3FF)
Border-radius: 20px
Padding: 20px
Border: none
Use for: balance hero card, active coverage banner
```

#### H. Chip / Badge
```
Background: --kavach-blue-light
Text: --kavach-blue-primary, 12px, font-weight: 600
Padding: 6px 12px
Border-radius: 20px (pill)
Icon (optional): 14px, left of text, 4px gap
Variants: green chip (success), amber chip (warning), red chip (alert)
```

#### I. List Row Item
```
Height: 64px minimum
Padding: 0 20px
Left: icon circle (36px) OR avatar circle (36px)
Center: Primary text (14px, bold) + Secondary text (12px, gray) stacked
Right: Amount (16px, DM Mono, bold) + timestamp (11px, gray) stacked
Divider: 0.5px line at bottom, color #F0EEE8, inset left by 72px
```

#### J. Section Header Row
```
Layout: flex, space-between
Left: section title, 18px, font-weight: 700, --kavach-black
Right: "See all" link, 14px, --kavach-blue-primary
Margin bottom: 12px
```

#### K. Avatar Circle
```
Size: 40px (standard), 32px (compact), 52px (large/profile)
Border-radius: 50%
Image: cover, centered
Fallback: initials on --kavach-blue-light background, --kavach-blue-primary text
Online indicator: 10px green dot, bottom-right, white 2px border
```

#### L. Bottom Tab Bar
```
Height: 80px (includes safe area / home indicator space)
Background: #FFFFFF
Border-top: 1px solid #F0EEE8
5 tabs: Home, Protect, Earnings, Zones, Profile
Active tab: icon + label in --kavach-blue-primary
Inactive tab: icon + label in --kavach-gray-mid
Icon size: 22px
Label: 10px, font-weight: 500
Active indicator: 3px blue dot above label
```

#### M. Input Field
```
Height: 56px
Background: #F9FAFB
Border: 1.5px solid #E5E7EB
Border-radius: 14px
Focus border: --kavach-blue-primary
Padding: 0 16px
Font: 16px, --kavach-black
Label above: 13px, --kavach-gray-mid, margin-bottom: 6px
```

#### N. Shield Rating Icons (Zone Safety)
```
5 shields filled = zone-5 green
4 shields filled + 1 empty = zone-4 lime
3 filled + 2 empty = zone-3 amber
2 filled + 3 empty = zone-2 orange
1 filled + 4 empty = zone-1 red
Shield icon: 16px each, 3px gap between
```

#### O. Progress Bar (TrustKarma)
```
Track: #E5E7EB, height: 8px, border-radius: 4px
Fill: solid color by tier (Base: --karma-base, Silver: --karma-silver, Gold: --karma-gold, Platinum: --karma-platinum, Champion: --karma-champion)
Current position dot: 12px circle, white, 2px --kavach-blue-primary border
```

---

### 1.6 Device Frame & Layout Rules
```
Design at: 390px width × 844px height (iPhone 14 base)
Status bar height: 44px (include notch/dynamic island placeholder)
Safe area bottom: 34px (home indicator)
Screen horizontal padding: 20px on both sides (consistent rule — no screen breaks this)
Header height: 60px
Bottom tab bar: 80px fixed
Content area: 844 - 44 - 80 = 720px scrollable
```

---

## PART 2: SCREEN ARCHITECTURE & NAVIGATION

### 2.1 Navigation Map
```
ONBOARDING FLOW (linear, no back on some steps)
├── Splash
├── Language Selection
├── Value Proposition (3 slides)
├── Mobile Number Entry
├── OTP Verification
├── eKYC (Selfie + PAN — 2 sub-screens)
├── Platform Selection
├── Earnings Screenshot Upload
├── Account Aggregator Consent
├── Plan Selection
├── UPI AutoPay Setup
└── Welcome Confirmation → enters MAIN APP

MAIN APP (bottom tab navigation)
├── HOME TAB
│   ├── Home — Normal State
│   ├── Home — Active Disruption State (banner transforms)
│   ├── Disruption Live Screen (full-screen push notification action)
│   ├── Payout Processing Screen
│   └── Payout Received + Breakdown Screen
│
├── PROTECT TAB
│   ├── Policy Management Main
│   ├── Plan Upgrade/Downgrade Screen
│   └── Pause/Cancel Confirmation
│
├── EARNINGS TAB
│   ├── Earnings Insights Main
│   └── Per-Platform Detail Screen
│
├── ZONES TAB
│   ├── Zone Safety Map Main
│   └── Zone Detail Popup
│
└── PROFILE TAB
    ├── Profile & Settings Main
    ├── TrustKarma Detail Screen
    ├── Claims History
    ├── Claim Detail View
    └── Notifications Screen
```

---

## PART 3: EVERY SCREEN — FULL SPECIFICATION

---

### SCREEN 01 — SPLASH SCREEN

**Purpose:** Brand entry point, 2.5-second display, then auto-advance to Language Selection.

**Background:** `--kavach-bg-warm` (#F6F4F0)

**Layout (centered vertically and horizontally):**
- Top 40% empty space
- KAVACH logo mark: Blue shield icon, 72×72px, centered
  - Shield shape: rounded corners (16px), filled --kavach-blue-primary
  - Inside shield: stylized "K" lettermark in white OR abstract rainfall/wave cut-out
- "KAVACH" wordmark: 36px, font-weight: 800, --kavach-black, 16px below logo
- "कवच" subtitle: 18px, font-weight: 500, --kavach-blue-primary, 6px below wordmark
- Tagline: "Rain ko mat daro." — 15px, font-style: italic, --kavach-gray-mid, 20px below
- Bottom area: Three dots loader animation (3 × 8px dots, --kavach-blue-primary, sequentially scaling)

**Animations:**
- Logo: fade-in + scale from 0.8 to 1.0 over 600ms, ease-out
- Wordmark: fade-in 400ms delay
- Tagline: fade-in 600ms delay
- Transition to next screen: fade-out entire screen at 2500ms

---

### SCREEN 02 — LANGUAGE SELECTION

**Purpose:** Worker selects their preferred language. Device locale auto-highlights the best match.

**Header:** No navigation bar. Top padding 60px.

**Layout:**
- Title: "अपनी भाषा चुनें / Choose your language" — 24px, bold, centered, --kavach-black. Two-line (Hindi on top, English below, smaller)
- Subtitle: "You can change this anytime" — 13px, --kavach-gray-mid, centered, 8px below title
- Spacing: 32px below subtitle

**Language Grid (2 columns, gap: 12px):**
Each language card:
- Size: Full width ÷ 2 minus gap = ~175px wide, 72px tall
- Background: #FFFFFF
- Border: 1.5px solid #E5E7EB
- Border-radius: 16px
- Layout inside: Language name (native script) — 18px, bold, --kavach-black; Language name (English) — 12px, --kavach-gray-mid; 4px gap between
- Selected state: border-color --kavach-blue-primary (2px), background --kavach-blue-light, language name color --kavach-blue-primary
- Auto-selected based on device locale (show a faint checkmark badge top-right)

**6 Language Cards:**
```
Row 1: हिंदी (Hindi)  |  English
Row 2: தமிழ் (Tamil)  |  తెలుగు (Telugu)
Row 3: বাংলা (Bengali) |  ಕನ್ನಡ (Kannada)
```

**Bottom:**
- Spacing: 40px below grid
- Primary CTA Button: "Continue / आगे बढ़ें" — standard pill button, --kavach-blue-primary
- Button: fixed to bottom, 20px side padding, 32px from bottom safe area

---

### SCREEN 03A — VALUE PROPOSITION (SLIDE 1 OF 3)

**Purpose:** First of 3 auto-advancing or swipeable onboarding slides. No skip — workers must see all 3.

**Background:** #FFFFFF

**Header:**
- Top-right: Step indicator — 3 dots, dot 1 active (--kavach-blue-primary, 20px wide pill), dots 2-3 passive (8px circle, --kavach-gray-light)
- No back button on slide 1

**Illustration area (top 45% of screen):**
- Full-width illustration panel, background: --kavach-blue-light (#E8F3FF)
- Illustration: A delivery worker on scooter in rain, but with a blue shield "bubble" around them. Character is friendly, South Asian-coded, wearing rain gear. Flat illustration style (like Zomato/Swiggy onboarding art). Rain drops visible outside the shield, dry inside.
- Illustration height: 340px from top of screen

**Content area (bottom 55%):**
- Background: #FFFFFF
- Padding: 28px horizontal, 32px top
- Large emoji icon alternative: 🛡️ as blue circle badge, 48px, background --kavach-blue-light, border-radius 50%, centered
- Headline: "Baarish aaye, paisa aaye" — 26px, bold, --kavach-black, centered, line-height 1.3
- Sub-headline English translation: "Rain comes, money comes" — 15px, --kavach-gray-mid, centered, 8px below
- Body: "When heavy rain, severe pollution, or floods stop your deliveries, KAVACH automatically sends money to your PhonePe/GPay. No claims. No calls. Just money." — 15px, --kavach-gray-dark, centered, line-height 1.6, 20px top margin
- Highlight pill: Blue chip showing "₹ arrives in 4 minutes" — centered, 20px top margin

**Bottom (fixed):**
- "Next" pill button (full width, --kavach-blue-primary)
- 12px below: "Already have an account? Sign in" — 13px, centered, --kavach-blue-primary link

---

### SCREEN 03B — VALUE PROPOSITION (SLIDE 2 OF 3)

**Illustration:** Worker looking at phone, green checkmark and money bag floating. Background: --kavach-green-light tint (#DCFCE7).

**Headline:** "Sirf ₹65/hafte. Automatic." (Only ₹65/week. Automatic.)

**Body:** "Every Monday, ₹65 is deducted from your UPI. When disruption hits your zone, your money arrives automatically — no form, no call, no waiting."

**Three feature rows (each row: icon circle left + text right):**
```
Row 1: Blue cloud-rain icon circle | "Rain, AQI, flood, heatwave — all covered"
Row 2: Blue lightning bolt icon    | "Payout in under 4 minutes"
Row 3: Blue shield icon            | "Works on Zomato, Swiggy, Zepto, Amazon — all platforms"
```
Each row: 56px height, icon circle 36px, --kavach-blue-light background, 12px gap, text 14px --kavach-black

---

### SCREEN 03C — VALUE PROPOSITION (SLIDE 3 OF 3)

**Illustration:** Three tier cards floating with ₹35, ₹65, ₹99 labels. Coins/rupee symbols around them. Background: --kavach-amber-light tint.

**Headline:** "Choose your protection level"

**Three mini plan preview cards (horizontal scroll):**
Each card: 140px wide, white bg, 16px radius, 16px padding:
```
Starter:  "₹35/week"  →  "Up to ₹1,500"
Standard: "₹65/week"  →  "Up to ₹2,500" ← "Most popular" blue badge
Shield:   "₹99/week"  →  "Up to ₹3,500"
```

**Body:** "Cancel or pause anytime. Your coverage moves with you — not with any single app."

**CTA:** "Get started — it's free to try" (first week promotional messaging if applicable, else standard "Start Protection")

---

### SCREEN 04 — MOBILE NUMBER ENTRY

**Header:** Back arrow (left), title "Your mobile number" (centered, 17px, bold)

**Background:** --kavach-bg-warm

**Content:**
- Top illustration: Small phone icon in --kavach-blue-light circle, 56px, centered, 40px top margin
- Headline: "Enter your Zomato/Swiggy registered number" — 22px, bold, --kavach-black, 16px below icon
- Sub: "We'll send a 6-digit OTP to verify" — 14px, --kavach-gray-mid, 8px below

**Input section (32px top margin):**
- Country code pill: "+91" — left element inside input, 16px bold, separated by 1px vertical divider
- Phone number input: 10-digit field, numeric keyboard, placeholder "98765 43210", large text (24px, DM Mono, bold, --kavach-black)
- Input container: full width, 64px height, --kavach-gray-faint background, 1.5px border, border-radius: 16px, padding: 0 16px

**Below input:**
- "By continuing, you agree to our Terms & Privacy Policy" — 12px, --kavach-gray-mid, centered, linked text blue

**Bottom:**
- "Send OTP" primary button
- Disabled state until 10 digits entered

---

### SCREEN 05 — OTP VERIFICATION

**Header:** Back arrow, "Verify your number" centered

**Content:**
- Sub: "We sent a 6-digit OTP to +91 98765 43210 — Edit" (Edit is a blue tappable link)
- 40px top margin

**OTP Input (6 separate boxes):**
```
6 × individual boxes, each: 52px × 64px, border-radius: 14px
Default: --kavach-gray-faint bg, 1.5px --kavach-gray-light border
Active/filled: --kavach-bg-card bg, 2px --kavach-blue-primary border
Entered digit: 28px, DM Mono, bold, --kavach-black, centered
Gap between boxes: 10px
Auto-focus next box on digit entry
```

**Below OTP boxes (24px margin):**
- OTP auto-read from SMS (Android SMS Retriever API) — show "Reading OTP automatically..." if permission granted, as small blue chip

**Resend section:**
- "Resend OTP in 00:28" — 14px, --kavach-gray-mid, centered
- After timer ends: "Resend OTP" — 14px, --kavach-blue-primary, bold, tappable

**Bottom:**
- "Verify" primary button (disabled until all 6 boxes filled)
- Auto-submits when 6th digit entered (no need to tap Verify)

**Success state:**
- All 6 boxes turn green (#DCFCE7 bg, green border)
- Checkmark icon fades in above boxes
- Auto-advance after 500ms

---

### SCREEN 06 — eKYC: SELFIE SCREEN

**Header:** Back arrow, "Verify your identity" centered

**Progress bar:** 2-step indicator at top. Step 1 active (selfie), Step 2 upcoming (PAN). Blue filled circles connected by line.

**Camera preview area:**
- Oval frame overlay (face-fit guide): 240px × 300px oval, dashed blue border (8px dashes), centered
- Inside oval: Live camera feed
- Outside oval: 40% opacity dark overlay
- Top of camera area: "Position your face within the oval" — 13px, white, centered
- Face detection indicator: When face detected → oval border turns solid green + "Face detected ✓" in green chip

**Instruction chips (below camera area, 16px top margin):**
```
Chip 1: "Good lighting" (sun icon)
Chip 2: "Remove glasses" (glasses icon)
Chip 3: "Face the camera" (camera icon)
```
3 chips in a horizontal row, blue tint chips, 10px gap

**Bottom:**
- "Take Selfie" primary button
- "This is for KYC only and will not be stored" — 12px, --kavach-gray-mid, centered below button

---

### SCREEN 07 — eKYC: PAN ENTRY

**Header:** Back, "PAN verification" centered

**Progress:** Step 2 active

**Content:**
- Illustration: Small card icon in blue circle (36px)
- Headline: "Enter your PAN number" — 20px, bold
- Sub: "Required for IRDAI-compliant insurance policy" — 14px, gray

**PAN input:**
- Single large input field
- Placeholder: "ABCDE 1234 F" with space formatting
- Auto-uppercase
- Font: 28px, DM Mono, bold, letter-spacing: 4px (spaced like a card number)
- Input: 72px height, full width, rounded 16px

**Verification states:**
- Typing: neutral border
- Verified (green tick right-side of input): "PAN verified ✓" in green
- Failed: red border + "PAN not found — check and retry" message below

**Bottom:**
- "Verify PAN" primary button
- Disabled until valid PAN format entered (XXXXX9999X)

---

### SCREEN 08 — PLATFORM SELECTION

**Header:** Back, "Which apps do you work on?" centered

**Sub-header:** "Select all that apply — your coverage works across all of them" — 14px, gray, centered

**Platform grid (2 columns, 12px gap, 24px top margin):**
Each platform card: ~175px × 96px:
```
Card layout: platform logo (48px, centered) + platform name below (14px, bold)
Default: white bg, 1.5px gray border, 16px radius
Selected: --kavach-blue-light bg, 2px --kavach-blue-primary border, blue checkmark badge top-right (20px circle, white check on blue)

Platforms (6 cards):
Row 1: [Zomato logo]         |  [Swiggy logo]
Row 2: [Zepto logo]          |  [Blinkit logo]
Row 3: [Amazon Flex logo]    |  [Flipkart Quick logo]
```

**Below grid (16px margin):**
- Subtle note: "Don't see your app? Contact support" — 13px, blue link

**Bottom:**
- "Continue" primary button — disabled until at least 1 platform selected
- Active: shows count badge "3 platforms selected" above button in blue chip

---

### SCREEN 09 — EARNINGS SCREENSHOT UPLOAD

**Header:** Back, "Show us your earnings" centered

**Step indicator:** Step 1 of 2 (screenshot), Step 2 is AA consent

**Content (for each selected platform, show tabs or sequential screens):**

**Platform tab selector:**
- Pill toggle selector for each platform (horizontal scroll if more than 2)
- Active platform tab: blue pill
- E.g., tabs: "Zomato | Swiggy | Zepto"

**For the active platform (e.g., Zomato):**
- Instruction heading: "Screenshot your Zomato earnings" — 18px, bold
- Illustrated guide card (white bg, rounded): Shows an annotated screenshot preview of the Zomato Partner App earnings screen:
  - Top: Small phone mockup illustration showing the earnings screen path
  - Breadcrumb path: "Profile → Earnings → Last 30 days" (each step as a blue chip with arrow between)
  - "Tap here" highlight circle animation on the right spot in the illustration

- Upload zone (below guide):
  - Dashed border (2px, --kavach-blue-primary, dashed), border-radius: 20px, 140px height
  - Inside: Upload icon (cloud with up arrow, 32px, --kavach-blue-primary) + "Tap to upload screenshot" (15px) + "or take photo" (13px, gray) below
  - After upload: preview thumbnail of screenshot appears inside the zone
  - Processing state: blue spinner + "Reading your earnings..." text

- Parsed result card (appears after successful OCR):
  - Green background card: "We found ₹18,400 from your last 30 days on Zomato"
  - Number in large DM Mono: "₹18,400"
  - "Is this correct?" below with "Yes, looks right ✓" button (green) and "Re-upload" link

**Bottom:**
- "Next" primary button — active after all selected platforms have uploads

---

### SCREEN 10 — ACCOUNT AGGREGATOR CONSENT

**Header:** Back, "Verify with your bank" centered

**Background:** --kavach-bg-warm

**RBI Trust Badge:**
- Top of content area: "Approved by RBI" badge — small RBI logo + text, in a gray chip, centered

**Explanation card (white, rounded):**
- Heading: "Why we need this" — 16px, bold
- Body: "KAVACH connects to your bank (where Zomato/Swiggy payments arrive) to verify your earnings automatically. This is done via India's RBI-approved Account Aggregator system — fully secure and reversible." — 14px, gray, line-height 1.6

**How it works (3 steps, vertical):**
```
Step 1 icon (blue circle, "1") + "You give one-time permission"
Step 2 icon ("2") + "Your bank shares your UPI payment data"  
Step 3 icon ("3") + "Kavach reads only your gig app payments"
```
Each step: 56px height, number circle (32px, --kavach-blue-light, --kavach-blue-primary text), step text (14px, bold, --kavach-black)

**Key reassurance points (below steps, 20px margin):**
3 chips in a horizontal wrap:
- "🔒 RBI regulated" (green chip)
- "Not stored after 24hr" (green chip)
- "Cancel anytime" (green chip)

**Bank selector:**
- "Select your bank" label
- Dropdown or grid of popular banks: SBI, HDFC, ICICI, Axis, Kotak, PNB, + "Other banks" option
- Each bank: logo (32px) + bank name (13px), in rounded card

**Bottom:**
- "Connect via Finvu / OneMoney" primary button (include the AA partner logo inline)
- "Skip for now — I'll do this later" — secondary text link, gray, 12px, centered

---

### SCREEN 11 — PLAN SELECTION

**Header:** No back arrow (this is a key decision screen), "Choose your protection" centered

**Background:** --kavach-bg-warm

**Sub-header:** "Deducted every Monday. Cancel anytime." — 14px, gray, centered

**Top banner (if AI has computed personalized premium):**
- Blue info chip: "Your zone has moderate risk this week — prices shown are personalized" — small, centered

**Plan cards (3 cards, full width, 12px gap):**

**STARTER CARD (₹35/week):**
```
Background: #FFFFFF
Border: 1.5px solid #E5E7EB
Border-radius: 20px
Padding: 20px

Top row: Plan name "Starter" (16px, bold, --kavach-black) | Weekly price "₹35/week" (20px, DM Mono, bold, --kavach-blue-primary)
Divider line
Coverage line: "Covers 50% of daily loss" (14px, gray)
Max payout: "Up to ₹1,500 this week" (14px, --kavach-black, bold)
Example chip: "Rain stops work? Recover ₹280 today" (12px, blue chip)
```

**STANDARD CARD (₹65/week) — MOST POPULAR:**
```
Background: --kavach-blue-primary (#1A56DB)  ← Only this card has blue bg
Border: none
Border-radius: 20px
Padding: 20px

"Most popular" pill badge: white bg, --kavach-blue-primary text, top-right corner, 10px × 24px pill, font-size 11px

Plan name: "Standard" (16px, bold, WHITE)
Weekly price: "₹65/week" (24px, DM Mono, bold, WHITE)
Coverage: "Covers 70% of daily loss" (14px, white, 80% opacity)
Max payout: "Up to ₹2,500 this week" (14px, white, bold)
Example chip: white bg, blue text — "Rain stops work? Recover ₹392 today"
```

**SHIELD CARD (₹99/week):**
```
Same layout as Starter card
Plan name: "Shield" (16px, bold, --kavach-black)
Weekly price: "₹99/week" (20px, DM Mono, bold, --kavach-black)
Coverage: "Covers 90% of daily loss" (14px, gray)
Max payout: "Up to ₹3,500 this week" (14px, --kavach-black, bold)
Example chip: "Rain stops work? Recover ₹504 today" (amber chip, for premium differentiation)
```

**Comparison link:** "Compare all features →" — 13px, --kavach-blue-primary, centered, 16px below cards

**Bottom:**
- Selected card gets a blue ring (2px --kavach-blue-primary border)
- "Start with Standard" primary button (label updates based on selection)
- This week costs "₹65" highlighted inline in the button

---

### SCREEN 12 — UPI AUTOPAY SETUP

**Header:** Back, "Set up weekly payment" centered

**Background:** --kavach-bg-warm

**Summary card (top, blue tint):**
```
Background: --kavach-blue-light
Border-radius: 20px
Padding: 20px
Content:
  - "Your Standard plan" — 14px, gray
  - "₹65 every Monday" — 28px, DM Mono, bold, --kavach-blue-primary
  - "Starting next Monday, [date]" — 13px, gray
```

**UPI ID input (24px below card):**
- Label: "Your UPI ID"
- Input with "@" prefix styling
- Placeholder: "yourname@upi"
- After valid format: green tick inside input right edge

**OR divider:** "— or pay via —" (small gray text with lines either side)

**UPI App selector (horizontal row, 16px top margin):**
4 large tappable options (equal width, 2×2 grid or horizontal scroll):
```
[PhonePe logo] PhonePe     [GPay logo] Google Pay
[Paytm logo]   Paytm       [BHIM logo] BHIM UPI
```
Each: 80px wide, 72px tall, white card, rounded 16px, app icon (36px) + name below (12px)
Selected: blue border, --kavach-blue-light background

**AutoPay explanation (16px below selector):**
- Info row: Lock icon (green, 16px) + "Authorized by NPCI. Cancel anytime from your UPI app." — 12px, gray

**Bottom:**
- "Authorize ₹65/week" primary button
- Tapping opens the selected UPI app deep-link OR Razorpay mandate sheet

---

### SCREEN 13 — WELCOME / ENROLLMENT CONFIRMATION

**Background:** --kavach-bg-warm

**Full-screen celebration layout:**

**Top section (60% of screen, centered):**
- Shield icon (KAVACH logo, 80px) with animated green checkmark overlay that draws itself (stroke animation, 600ms)
- "You're protected!" — 28px, bold, --kavach-black, centered, 24px below icon
- "कवच active" — 16px, --kavach-blue-primary, centered in blue chip
- Subtle confetti or floating shield particles animation (optional, tasteful)

**Details card (white, rounded, 24px margin):**
```
Row 1: "Your plan"          | "Standard"
Row 2: "Weekly cost"        | "₹65 (every Monday)"
Row 3: "First deduction"    | "Monday, [date]"
Row 4: "Coverage starts"    | "Right now ✓"
Row 5: "Your baseline"      | "₹18,400 / month"
```
Each row: label (14px, gray) on left, value (14px, bold, --kavach-black) right-aligned
Row dividers: faint line

**Platform logos strip (horizontal):**
"Protecting income from:" label + platform logos (24px each, horizontal row with 8px gap)

**Bottom:**
- "Go to Dashboard" primary button
- "Policy sent to your WhatsApp" — 13px, --kavach-green, centered, with WhatsApp icon (16px)

---

### SCREEN 14 — HOME SCREEN (NORMAL STATE)

**This is the most important screen — workers will see this daily.**

**Header (60px, --kavach-bg-warm background):**
- Left: Avatar circle (36px) with worker initials/photo + "Hey, Rajan 👋" (16px, bold)
- Right: Bell icon (notification indicator dot) + Shield icon (policy active indicator, green dot)

**Coverage Status Banner (below header, 16px margin):**
```
Background: --kavach-blue-light (#E8F3FF)
Border-radius: 20px
Padding: 18px 20px
Content:
  Left: Shield icon (28px, --kavach-blue-primary) + "Protected until Sunday" (15px, bold, --kavach-black) stacked + "Standard plan active" (12px, --kavach-gray-mid) below
  Right: Days remaining: "5 days" (22px, DM Mono, bold, --kavach-blue-primary) + "remaining" (11px, gray) below
```

**Zone Safety Tile (16px below banner):**
```
Background: #FFFFFF, border-radius: 20px, padding: 18px 20px
Header row: "Your zone today" (16px, bold) | "Details →" (13px, blue link)
Below header: 
  Left half: Zone name "Koramangala" (15px, bold) + City "Bengaluru" (12px, gray)
            5 shield icons rendered (3 filled green, 2 empty) = "3/5 shields"
            "Moderate risk" label (green chip at this level)
  Right half: Weather snapshot — rain icon + "28°C" + "No rain expected" text (12px, gray)
             AQI circle: "AQI 82" in a small circular badge (green at this level)
```

**Earnings Today (16px below zone tile):**
```
Background: #FFFFFF, border-radius: 20px, padding: 18px 20px
Header row: "Today's earnings" (16px, bold) | "Last 24hr data" (12px, gray)
Large number: "₹380" (32px, DM Mono, bold, --kavach-black)
Progress bar below number: 
  - Track full width, 8px height, rounded
  - Filled blue to 51% ("₹380 of expected ₹740")
  - "vs ₹740 expected" label below bar (12px, gray)
Below bar: "Your 30-day baseline: ₹740/day" (12px, gray)
```

**72-Hour Forecast Strip (16px below earnings):**
```
Background: #FFFFFF, border-radius: 20px, padding: 16px 20px
Header: "This week's risk forecast" (16px, bold)
3-column row: Today | Tomorrow | Day after
Each column:
  - Day label (12px, bold, gray)
  - Weather icon (rain, sun, cloud — 24px)
  - Risk level dot (green/amber/red, 8px circle)
  - Probability (12px, gray): "24% rain"
Active column (Today) has light blue background within the card
```

**Quick Stats Row (horizontal, 2 cards, 16px below forecast):**
```
Card 1 (half width): "This week's premium" | "₹65 ✓" in green, paid Monday
Card 2 (half width): "Payouts this week" | "₹0" (no disruption) OR "₹518 ✓" if paid
Each card: white bg, 14px radius, padding 14px
```

**TrustKarma Quick View (16px below stats):**
```
Background: white, border-radius: 20px, padding: 18px 20px
Left: "TrustKarma" label (14px, bold) + score "485 / 1000" (16px, DM Mono, bold, gold color)
Center: Progress bar filling 48.5%
Right: Tier badge chip "Silver tier" (amber/gray chip)
Below: "+5 points this week for active policy" (12px, green, italic)
Tap to go to full TrustKarma screen
```

**Bottom Tab Bar (standard, 80px)**

---

### SCREEN 15 — HOME SCREEN (ACTIVE DISRUPTION STATE)

**Same as Screen 14 but with these changes:**

**FULL-WIDTH DISRUPTION BANNER replaces Coverage Status Banner:**
```
Background: #FF5E1A (strong orange-red) 
Height: 88px
Border-radius: 20px
Padding: 16px 20px
Left: Disruption icon (animated rain cloud, 32px, white) + "Heavy rain in your zone" (16px, bold, white)
      "Detected 12 minutes ago" (12px, white, 70% opacity) below
Right: "View details →" (14px, white, bold)
        Pulsing orange dot (12px, animated pulse) 
```

**Zone Safety Tile becomes:**
```
Red/amber border on the tile (2px orange)
Shields: 1 filled orange, 4 empty
"High risk — disruption active" label (red chip)
Live: "47mm/hr rainfall — WeatherUnion" (12px, italic, gray)
```

**Earnings card shows live shortfall:**
```
"Today's earnings" — ₹210
Progress bar: only 28% filled (very short blue bar)
"₹530 below your expected ₹740" — in amber/orange text (warning color)
"You may be eligible for payout" chip — blue, pulsing
```

**Estimated payout card (NEW, appears during disruption):**
```
Background: --kavach-green-light (#DCFCE7)
Border-radius: 20px
Padding: 18px 20px
Green shield icon (28px) on left
"Estimated payout if disruption continues:" (14px, gray) — line 1
"₹371" (36px, DM Mono, bold, --kavach-green) — hero number
"Processing starts when disruption score hits 70/100" (12px, gray, italic)
Live disruption score bar: "Current score: 64/100" — bar 64% filled orange
```

---

### SCREEN 16 — DISRUPTION LIVE SCREEN

**Access:** Worker taps on disruption banner OR notification

**Header:** Back (X close) top-left, "Live disruption" centered, "Zone: Koramangala" subtitle below title (smaller, gray)

**Live Map (top 45% of screen):**
- Map showing worker's city with zone overlay
- Affected zones: orange/red gradient overlay on flood/rain-affected 500m cells
- Worker's current zone: pulsing orange circle marker
- Other zones: color-coded by disruption severity
- Map style: clean, minimal (like Zepto/Blinkit delivery maps)
- Map controls: zoom in/out (small buttons, bottom-right of map area)

**Live data panel (below map, white card full-width):**
```
3-column data strip:
Col 1: Rain icon + "52mm/hr" (DM Mono, bold, 20px) + "Rainfall" (10px, gray label)
Col 2: Shield icon + "64/100" (DM Mono, bold, 20px, amber) + "Risk score" (10px, gray)
Col 3: Clock icon + "38 min" (DM Mono, bold, 20px) + "Duration" (10px, gray)
```

**Payout estimate card:**
```
Heading: "Your live estimate" (16px, bold)
Large: "₹371" (40px, DM Mono, bold, --kavach-green)
Sub: "Based on ₹530 shortfall × 70% coverage"
Progress bar labeled: "Payout triggers when score reaches 70" 
Bar filled 64% in amber → auto-updates live
"Score updates every 15 minutes from WeatherUnion + IMD" (11px, gray, italic)
```

**Data sources strip (proof/transparency — key trust-builder):**
```
"Verified by:" label (12px, gray)
Source chips in a row:
  [WeatherUnion icon] WeatherUnion (green verified chip)
  [IMD logo] IMD (green verified chip)
  [CPCB logo] CPCB (gray — not triggered)
```

**Bottom:**
- "Go back" ghost button (full width, outline style)
- If already triggered: "Payout processing..." state button (disabled, blue spinner)

---

### SCREEN 17 — PAYOUT PROCESSING SCREEN

**Full-screen processing state — minimal, confident**

**Background:** --kavach-bg-warm

**Center content (vertically centered):**
- Animated KAVACH shield logo (slow rotation/pulse, blue)
- "Processing your payout" — 22px, bold, --kavach-black, 24px below shield
- "₹371 is being sent to your PhonePe" — 16px, gray, 8px below heading
- 
**Progress steps (vertical, 40px below text):**
```
Step 1: ✓ blue checkmark | "Disruption verified" (14px, bold) | "WeatherUnion + IMD confirmed" (12px, gray)
Step 2: ✓ blue checkmark | "Earnings shortfall confirmed" (14px, bold) | "₹530 below your baseline" (12px, gray)  
Step 3: ● spinning loader | "Sending to your UPI account" (14px, bold, --kavach-blue-primary) | "Usually under 2 minutes" (12px, gray)
Step 4: ○ upcoming      | "Payout received" (14px, gray)

Each step: left icon (24px) + text block, 20px gap between steps, 16px padding
Checkmark: green circle with white check, 24px
Spinner: blue circle, 24px
Upcoming: gray empty circle, 24px
```

**Bottom:**
- Small gray text: "You'll get a notification when money arrives. You can close this screen." — 13px, gray, centered
- "Close" ghost button (not CTA prominence — payout is automatic)

---

### SCREEN 18 — PAYOUT RECEIVED + BREAKDOWN

**Access:** Worker taps notification OR auto-shown after payout

**Header:** X close button (top right)

**Background:** --kavach-bg-warm

**Success hero (top, 200px area):**
- Large green checkmark circle (80px, animated draw-in stroke)
- "₹371 received!" — 32px, DM Mono, bold, --kavach-green, 16px below
- "Sent to PhonePe · Just now" — 14px, --kavach-gray-mid

**Breakdown card (24px below hero):**
```
Card: white, 20px radius, 20px padding

Title: "How your payout was calculated" (16px, bold, --kavach-black)
Divider
Row 1: "Expected earnings today"  | "₹740"
Row 2: "Actual earnings (verified)" | "₹210"  
Row 3: "Shortfall"                 | "₹530"
Divider (slightly stronger)
Row 4: "Your plan covers"          | "70% (Standard)"
Row 5: "Disruption severity"       | "1.0× (Heavy rain)"
Divider (blue, 2px)
Row 6 (TOTAL): "Your payout"       | "₹371" (20px, DM Mono, bold, --kavach-green)

Each row: 44px height, label (14px, gray) left, value (14px, bold, --kavach-black) right
```

**Data source transparency strip (below card):**
```
"Triggered by:" label + horizontal chips:
"WeatherUnion 52mm/hr" (green chip) | "IMD Red Alert" (green chip) | "Score: 78/100" (blue chip)
```

**TrustKarma update row (below data strip):**
```
Green bg card (subtle):
  Left: Karma icon (24px, gold) + "+10 TrustKarma points earned" (14px, bold, --kavach-green)
  Right: "485 → 495" (14px, DM Mono, --kavach-green)
```

**Bottom CTAs:**
- "View on PhonePe" — secondary button (opens PhonePe deep-link)
- "Back to Dashboard" — primary button

---

### SCREEN 19 — POLICY MANAGEMENT (PROTECT TAB)

**Header:** "Your protection" (h2, no back arrow — it's a tab)

**Background:** --kavach-bg-warm

**Current policy card (top, featured):**
```
Background: --kavach-blue-primary
Border-radius: 24px
Padding: 24px 20px

Top row: "Standard Plan" (18px, bold, white) | "Active ✓" (green pill badge, white text)
Weekly cost: "₹65 / week" (32px, DM Mono, bold, white)
Sub: "Next deduction: Monday, [date]" (13px, white, 70% opacity)
Divider (white, 40% opacity)
Bottom row: 3 mini stats:
  "Coverage: 70%" | "Max payout: ₹2,500/wk" | "Since: Jan 2026"
  Each: label (10px, white 60%) + value (13px, bold, white), centered, pipe-separated
```

**Coverage details card (white, 16px below):**
```
Title: "What's covered this week"
5 trigger rows (each: icon + trigger name + severity indicator):
  🌧 Heavy Rainfall — "Active" (green chip)
  💨 Severe AQI — "Active" (green chip)
  🌡 Extreme Heat — "Monitoring" (amber chip)
  🌊 Flood Alert — "Active" (green chip)
  🚫 Curfew / Bandh — "Active" (green chip)
Each row: 48px, icon (20px, blue circle bg), trigger name (14px, bold), chip right-aligned
```

**Action buttons row (3 circular buttons, full-width evenly):**
```
Button 1: Up-arrow icon, "Upgrade", blue circle
Button 2: Pause icon, "Pause", gray circle  
Button 3: X icon, "Cancel", red-tint circle
Labels below each: 11px, gray
```

**Linked platforms section:**
```
Title: "Earning from" + platform logos (32px each, horizontal row)
Connected: green dot on each connected platform logo
"Add another platform +" — 13px, blue link
```

**AutoPay info row:**
```
PhonePe logo (24px) + "PhonePe UPI mandate active" (14px) + "Edit" (blue link, right)
Green chip: "Next: ₹65 on Monday [date]"
```

---

### SCREEN 20 — EARNINGS TAB

**Header:** "Your earnings" (h2)

**Background:** --kavach-bg-warm

**Earnings hero card (blue tint):**
```
Background: --kavach-blue-light
Border-radius: 24px
Padding: 24px 20px

"30-day earnings" label (13px, blue, uppercase, letter-spacing)
"₹18,400" (44px, DM Mono, bold, --kavach-black) — hero number
"Verified via Account Aggregator" (12px, --kavach-green, with checkmark icon)

Period toggle below number: pill toggle — "30 days | 7 days | Today"
```

**Per-platform breakdown (cards, stacked, 16px gaps):**
For each platform worker has linked:
```
Card: white, 20px radius, padding 18px 20px
Left: Platform logo (36px circle bg, logo inside, 24px)
Center: Platform name (15px, bold) + "14 active days" (12px, gray)
Right: "₹11,200" (20px, DM Mono, bold, --kavach-black) + arrow to detail (chevron)
Below: mini progress bar showing platform's share of total earnings
```

**Daily earnings mini chart (white card, 16px below platforms):**
```
Title: "Daily trend this month" (16px, bold)
Bar chart: 30 vertical bars
  Regular days: --kavach-blue-light bars
  Disruption days: red/orange bars (with rain/AQI icon overlay)
  Height proportional to earnings
X-axis: dates (every 5th) — 10px, gray
Y-axis: ₹0, ₹500, ₹1000 labels — 10px, gray
Disruption days have a small cloud/rain icon above their bar
```

**Baseline comparison strip:**
```
3 stat chips in a row:
"Your avg/day: ₹613" | "Expected: ₹740" | "Difference: -₹127"
Gray chips for factual data
```

---

### SCREEN 21 — ZONE SAFETY MAP (ZONES TAB)

**Header:** "Zone safety" (h2) + city selector (pill toggle: "Bengaluru ▼")

**Map (takes top 55% of screen):**
- City map (Bengaluru / Delhi / etc.) with 500m grid cell overlay
- Each cell: colored overlay based on HLRG risk score:
  - Score 9-10 (1 shield): deep red, 60% opacity fill
  - Score 7-8 (2 shields): orange, 50% opacity
  - Score 5-6 (3 shields): amber, 45% opacity
  - Score 3-4 (4 shields): lime green, 40% opacity
  - Score 1-2 (5 shields): green, 35% opacity
- Worker's current zone: Pulsing blue dot marker
- Popular delivery zones: Name labels inside cells (small, 9px)
- Tap a cell: shows Zone Detail popup (bottom sheet)

**Legend (bottom-left of map overlay, white pill):**
Small 5-row legend: colored dot + "5 shields — Very safe", etc. (10px text)

**Today's conditions strip (below map, horizontal scroll chips):**
```
"Heavy rain in Koramangala" (red chip)
"High AQI in Electronic City" (amber chip)
"Clear in Whitefield" (green chip)
Each chip: 14px, icon + text, tappable → zoom to zone
```

**Zone search bar (below conditions):**
- "Search any zone in Bengaluru" — standard input, with map-pin icon left inside input

**Your saved zones section:**
```
Title: "Your frequent zones"
List rows (each): Zone name | Shield rating | Current risk | "→"
Max 3-4 rows visible, scroll for more
```

**Bottom sheet (when zone tapped — slides up from bottom, 50% height):**
```
Zone name (h3) + shields (5 icons) + risk level chip
3-stat row: "Flood freq", "Avg AQI", "Road quality" — historical data
"This week's forecast" — 3-day mini forecast for this zone
"Add to saved zones" — blue outline button
```

---

### SCREEN 22 — PROFILE TAB

**Header:** "Profile" (h2)

**Background:** --kavach-bg-warm

**Worker identity card (top, white, 20px radius, 20px padding):**
```
Left: Avatar circle (52px) with worker photo/initials
Center: Worker name (18px, bold) + "+91 98765 43210" (13px, gray) + "KYC verified ✓" (green chip, 12px)
Right: Edit icon (pencil, 20px, blue)
```

**TrustKarma card (16px below identity):**
```
Background: #FEF9E7 (flat gold tint)
Border: 1.5px solid #D97706
Border-radius: 20px
Padding: 18px 20px

Left: Trophy icon (32px, gold)
Center: "TrustKarma Score" (13px, gray uppercase) + "485" (32px, DM Mono, bold, --kavach-amber)
Right: "Silver tier" badge chip

Progress bar full width (below): 
  Track: #E5E7EB
  Fill: gold (#D97706) to 48.5%
  "500 for Gold →" label at 50% mark (small, gray)

Tap: goes to TrustKarma detail screen
```

**Menu list (white card, standard list rows, 16px below karma):**
```
Row 1: History icon (blue circle) + "Claims history" (14px, bold) + chevron
Row 2: Bell icon + "Notifications" + chevron + unread badge (if any)
Row 3: Link icon (blue) + "Linked platforms" + chevron
Row 4: Bank icon + "Linked bank / UPI" + chevron
Row 5: Document icon + "My policy documents" + chevron
Row 6: Help icon + "Help & support" + chevron
---  divider ---
Row 7: Language icon + "Language: हिंदी" + chevron
Row 8: Privacy icon + "Privacy settings & data" + chevron
Row 9: Logout icon (red) + "Sign out" + (red text, no chevron)
```

---

### SCREEN 23 — TRUSTKARMA DETAIL

**Header:** Back arrow, "TrustKarma" centered

**Background:** --kavach-bg-warm

**Score hero (top):**
```
Large circular progress ring: 160px diameter
Ring fills clockwise based on score (485/1000 = 48.5%)
Ring color: gold (#D97706) for Silver tier
Inside ring: "485" (36px, DM Mono, bold, gold) + "/ 1000" (14px, gray below)
Below ring: tier badge "Silver tier" (gold chip, 14px, bold) — centered
```

**Tier progression strip (horizontal, 5 tiers):**
```
Base [gray dot] → Silver [silver dot, CURRENT] → Gold [gold dot] → Platinum [blue dot] → Champion [purple dot]
Connected by dashed line
Current tier (Silver): dot is larger (16px vs 10px), label below in bold
Other tiers: smaller dot, lighter label
```

**Tier benefits card (for current tier):**
```
"Silver tier benefits" heading (16px, bold)
1 benefit row: "Kavach Verified badge on Zomato/Swiggy profile" ✓ (green)
"Next tier — Gold at 700 points:" (14px, bold, gray)
2 next benefits: "5% premium discount" ↑ | "Priority 2-hr support" ↑ (upcoming, grayed out with lock icon)
```

**Points history (list, last 10 entries):**
Section title: "Recent activity"
```
Each row: 52px height
Left: +/- icon (green +, red -)
Center: Reason (14px, bold) + date (12px, gray)
Right: Points change (+5, +10, -0) in green/red (14px, DM Mono, bold)

Examples:
+ | "Active policy — week 8" | +5 pts | Mar 15
+ | "Clean claim verified" | +10 pts | Mar 12
+ | "13-week streak!" | +20 pts | Mar 1
```

**How to earn more (expandable section at bottom):**
```
Title: "Earn more points" (16px, bold) + expand chevron
Content (if expanded):
  • "Maintain active policy every week: +5 pts/week"
  • "Verified clean claim: +10 pts"
  • "Quarterly continuous coverage: +20 pts"
  • "Refer a friend who enrolls: +25 pts [coming soon]"
```

---

### SCREEN 24 — CLAIMS HISTORY

**Header:** Back, "Claims history" centered

**Background:** --kavach-bg-warm

**Summary stats row (3 cards, horizontal):**
```
Card 1: "Total payouts" | "₹2,840" (DM Mono, green)
Card 2: "Claims this year" | "4 events"
Card 3: "Avg payout" | "₹710/event"
Card style: white, 14px radius, equal width (1/3 each), 12px gap, padding 14px
```

**Filter chips (horizontal scroll, below stats):**
All | Rain | AQI | Flood | Heat | Curfew
Active chip: --kavach-blue-primary, white text
Inactive: white bg, gray border, gray text

**Claims list (full width, below filters):**
Each claim row (white card, 20px radius, 16px padding, 12px gap between cards):
```
Top row: 
  Left: Disruption type icon in colored circle (rain = blue, AQI = amber, flood = teal)
  Center: Disruption type (15px, bold, --kavach-black) + Date (12px, gray)
  Right: Payout amount (18px, DM Mono, bold, --kavach-green) + "Received" label (10px, green)

Bottom row (below divider):
  "Rainfall 52mm/hr · WeatherUnion verified · Score: 78/100"
  All in gray, 11px, italic, with separator dots
  
Tapping: expands OR goes to Claim Detail Screen (Screen 25)
```

**Empty state (no claims yet):**
```
Center: Rain cloud illustration (light blue, friendly)
"No claims yet — that's good!" (16px, bold, gray)
"When disruptions hit your zone, payouts will appear here automatically." (14px, gray, centered)
```

---

### SCREEN 25 — CLAIM DETAIL VIEW

**Header:** Back, "Claim details" centered, Date in subtitle

**Content:**

**Status badge (top, centered):**
"₹371 Received" — large green pill badge (20px padding, rounded, green bg, white text, bold)

**Calculation card:**
Same breakdown as Screen 18 (payout received screen) — all rows showing the math

**Disruption evidence card (white, 20px radius, 20px padding):**
```
Title: "What caused this payout" (16px, bold)
---
Row: WeatherUnion | "52mm/hr recorded at 5:12 PM" | ✓ (green)
Row: IMD | "District: Red Alert issued" | ✓ (green)
Row: Disruption Score | "78 / 100 (threshold: 70)" | ✓ (green)
Row: Zone activity drop | "71% of zone workers went offline" | ✓ (green)
---
"All data certified for IRDAI records" (12px, green, italic, bottom)
```

**Earnings verification card:**
```
Title: "Your earnings on this day" (16px, bold)
Zomato: "₹210 earned (vs ₹480 expected)" — with mini bar visualization
Amazon Flex: "₹0 earned (vs ₹260 expected)" — completely disrupted
Total: "₹210 vs ₹740 expected" (larger, DM Mono, bold)
"Verified via Account Aggregator (Finvu)" (12px, green, with RBI badge icon)
```

**Bottom:**
"Download receipt (PDF)" — ghost/outline button (for workers who need proof)

---

### SCREEN 26 — NOTIFICATIONS

**Header:** Back, "Notifications" centered, "Mark all read" top-right (blue text)

**Background:** --kavach-bg-warm

**Notification list (grouped by Today, Yesterday, This week):**

Each notification row (white card, 12px radius, 14px padding, 8px gap between):
```
Height: 72px
Left: Icon circle (36px) — type-specific icon + bg color:
  Payout received: green circle, ₹ icon
  Disruption alert: orange circle, rain/cloud icon  
  Predictive alert: blue circle, clock/bell icon
  Premium deduction: blue circle, calendar icon
  Policy update: blue circle, shield icon
  Karma points: gold circle, trophy icon

Center: Notification title (14px, bold, --kavach-black) + Body text (12px, gray, 1 line, truncate)
Right: Time (11px, gray) + Unread indicator (6px blue dot if unread)

Unread notification row: slightly darker background (#F8F9FF)
```

**Sample notifications (shown in order, most recent first):**
```
● [Green] "₹371 received!" — "Heavy rain payout sent to PhonePe" · 2 min ago
● [Orange] "Heavy rain alert — Koramangala zone" — "Your ₹740 baseline is protected" · 4 hrs ago
  [Blue] "Kavach deducted ₹65" — "Your Standard plan renewed for this week" · Mon, 9 AM
  [Blue] "72-hr alert: Rain likely Thursday" — "65% chance, 5-10 PM. Your ₹740 is protected" · Yesterday
  [Gold] "+10 TrustKarma earned" — "Clean claim verified. Now 495 points (Silver)" · Yesterday
```

---

## PART 4: INTERACTION STATES & MICRO-INTERACTIONS

### 4.1 Button States
```
Default:    full opacity, normal scale
Hover:      background slightly darker (mobile = no hover, but include for web)
Active/tap: scale(0.96) transition (80ms ease-out) + ripple effect from tap point
Disabled:   opacity: 0.4, cursor: not-allowed
Loading:    spinner replaces label, button stays same size (no layout shift)
Success:    brief green flash (300ms) + checkmark, then returns to normal
```

### 4.2 Card Interactions
```
Tappable cards: slight scale-down on press (0.98, 100ms)
Swipeable list items: swipe-left reveals red "Delete" action (not used for claims — read-only)
Expandable sections: chevron rotates 180°, content height animates smoothly (300ms, ease-in-out)
```

### 4.3 Disruption Alert Animation
```
The disruption banner on Home screen (Screen 15):
- Pulses gently: border opacity oscillates (0.7 → 1.0 → 0.7) every 2 seconds
- The "Current score: 64/100" progress bar: live updates with a smooth fill transition (500ms per update)
- Disruption icon: subtle shake/wiggle on first appearance (300ms)
```

### 4.4 Payout Received Animation
```
On Screen 18 (payout received):
- Green checkmark draws itself (SVG stroke-dasharray animation, 600ms)
- Amount: counts up from ₹0 to ₹371 (400ms, ease-out, DM Mono font)
- Confetti: 12 small shield icons scatter outward from center, fade out (800ms, tasteful)
```

### 4.5 TrustKarma Ring
```
Circular progress ring on Screen 23:
- On screen entry: ring fills from 0% to current score with ease-out (800ms)
- Color transition at tier boundaries (gold at Silver, blue at Platinum, purple at Champion)
- Number inside: counts up from 0 to current score (synchronized with ring fill)
```

### 4.6 Loading States
```
Skeleton screens: show before data loads
  - Skeleton: #F0EEE8 background, pulsing opacity (0.5 → 1.0 → 0.5, 1.2s loop)
  - Skeleton shapes mirror the actual content layout (same heights, widths)
  - Never show empty/broken screens — always skeleton until data ready
```

---

## PART 5: EDGE CASES AND ERROR STATES

### 5.1 No Internet Connection
```
Banner at top of any screen (below status bar):
  Gray bar, full width, 36px height
  "No internet connection" (13px, white) centered
  Auto-hides when connection restores (slides up, 300ms)
  Data from last successful load remains visible (don't blank the screen)
```

### 5.2 Policy Lapsed / Not Active
```
Home Screen coverage banner becomes:
  Background: #FEE2E2 (red tint)
  Icon: Red shield (broken) 
  "Coverage paused — renew now" (15px, bold, --kavach-red)
  "₹65 deduction failed. Tap to fix." (13px, red)
  Right: "Renew →" button (red pill, white text, 28px height)
```

### 5.3 Premium Adjusted (Seasonal)
```
Notification sent Friday before week start
On Home screen: amber info banner below coverage card:
  "Your premium changes Monday: ₹65 → ₹81 (monsoon season in your zone)"
  "Learn why →" blue link
```

### 5.4 OCR Failed (Screenshot Unreadable)
```
On Screen 09 (earnings upload):
  Red outline on upload zone
  "We couldn't read this screenshot. Try:"
  3 suggestion chips: "Better lighting | Different page | Re-take screenshot"
  "Upload a different screenshot" primary button
```

### 5.5 AA Consent Declined
```
After Screen 10 consent is declined:
  Info sheet slides up (bottom sheet, 60% height):
    "Your coverage is still active, but:"
    Yellow warning list:
      "Your payouts may be 15% lower until we verify your earnings"
      "We'll re-ask in 14 days"
    "Connect bank later" (primary, blue)
    "I understand — continue without" (ghost, gray)
```

---

## PART 6: DESIGN DO's AND DON'Ts

### DO:
- Always show ₹ amounts in DM Mono font (monospace) — amounts look trustworthy, aligned
- Keep all screens on warm white (#F6F4F0) background — never pure white (#FFFFFF) as a background
- Use blue (#1A56DB) ONLY for: CTAs, active states, links, coverage-positive information
- Use green (#15803D) ONLY for: successful payouts, verified status, received money
- Use orange/amber ONLY for: disruption active, AQI warnings, earn-attention states
- Use red ONLY for: policy lapsed, critical errors, high-risk zones, severe disruptions
- Maintain 20px horizontal screen padding on EVERY screen without exception
- Show concrete ₹ amounts everywhere — never percentages alone ("₹392" not just "70%")
- All copy in worker's selected language (Hindi as default for reference prompt)
- Bottom tab bar is ALWAYS visible in main app — never hide it

### DON'T:
- Don't use purple, pink, or teal — keep to the reference color palette
- Don't use gradients (reference images are flat, no gradients)
- Don't show any "claims" language — use "payout", "money received", "protection"
- Don't use insurance jargon: no "premium" in worker copy (use "weekly cost"), no "indemnity", no "policyholder"
- Don't use ALL CAPS anywhere
- Don't show decimal places on ₹ amounts under ₹100 (show "₹65" not "₹65.00")
- Don't make any element smaller than 44px tap target (accessibility)
- Don't use shadows (the reference design is completely flat)
- Don't put more than 3 CTAs on any one screen

---

## PART 7: COPY GUIDELINES BY SCREEN SECTION

### 7.1 Worker-Facing Terminology Map
```
"Premium" → "Weekly cost" or "Hafte ki rakam"
"Policy" → "Protection" or "Suraksha"  
"File a claim" → NEVER USE — replaced by "Receive automatic payout"
"Insurance" → "Income protection" or "Kamai suraksha"
"Coverage" → "Protection level" or "Coverage"
"Insured" → "Protected" with shield icon
"Claim rejected" → NEVER USE — parametric never rejects
"Loss of pay" → "Disruption payout" or "Baarish ka paise"
"Policyholder" → "Member" or "Partner"
"Reinsurer" → NEVER MENTION to workers
"Fraud detection" → NEVER MENTION to workers
"Baseline" → "Your usual daily earnings" or "Aapki aam kamai"
```

### 7.2 Key Screen Headlines (Hindi + English)
```
Home: "Aaj ka haal" / "Today's status"
Disruption active: "Baarish aa gayi! Aapke paise safe hain" / "Rain hit! Your money is safe"
Payout received: "Paise aa gaye!" / "Money arrived!"
Plan selection: "Apna protection chuniye" / "Choose your protection"
Onboarding: "Rain ko mat daro" / "Don't fear the rain"
Zone map: "Aapke zone ka haal" / "Your zone's status"
Earnings: "Aapki kamai" / "Your earnings"
TrustKarma: "Aapka bharosa score" / "Your trust score"
```

---

## PART 8: SUMMARY SCREEN COUNT AND FLOW

| # | Screen Name | Primary Goal |
|---|------------|-------------|
| 01 | Splash | Brand entry |
| 02 | Language Selection | Localization |
| 03A-C | Value Proposition (3 slides) | Trust building |
| 04 | Mobile Number Entry | Identity start |
| 05 | OTP Verification | Phone verification |
| 06 | eKYC — Selfie | KYC compliance |
| 07 | eKYC — PAN Entry | KYC completion |
| 08 | Platform Selection | Multi-platform setup |
| 09 | Earnings Screenshot | Provisional baseline |
| 10 | AA Consent | Earnings verification |
| 11 | Plan Selection | Conversion |
| 12 | UPI AutoPay Setup | Payment mandate |
| 13 | Welcome Confirmation | Enrollment complete |
| 14 | Home — Normal | Daily engagement |
| 15 | Home — Disruption Active | Live protection |
| 16 | Disruption Live Screen | Live tracking |
| 17 | Payout Processing | Trust confirmation |
| 18 | Payout Received + Breakdown | Delight + transparency |
| 19 | Policy Management (Protect tab) | Policy control |
| 20 | Earnings Tab | Income insights |
| 21 | Zone Safety Map | Pre-shift planning |
| 22 | Profile Tab | Account management |
| 23 | TrustKarma Detail | Loyalty system |
| 24 | Claims History | History + trust |
| 25 | Claim Detail View | Full transparency |
| 26 | Notifications | All alerts |

**Total: 26 screens (3 onboarding variants, 5 main tabs, full disruption flow, detail screens)**

---

*KAVACH UI/UX Design Specification v1.0 · March 2026 · Reference design system: warm cream background + royal blue primary + DM Sans/DM Mono typography + fully pill-shaped buttons + circular action buttons + rounded white cards + flat (no shadows/gradients)*
