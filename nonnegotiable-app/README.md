# Nonnegotiable

A minimal Expo + React Native + NativeWind app for tracking **one** daily nonnegotiable commitment.

## Concept

You define a project. One nonnegotiable daily action. One-sentence "why". Then you check it off every day. If you skip a day, the streak dies.

## Stack

- **Expo SDK 52** (React Native 0.76)
- **Expo Router v4** (file-based routing, typed routes)
- **NativeWind v4** (Tailwind CSS for React Native)
- **AsyncStorage** (local-only persistence)
- **TypeScript**

## Structure

```
app/
  _layout.tsx           # Root layout + setup-vs-main routing
  setup.tsx             # First-launch onboarding
  (tabs)/
    _layout.tsx         # Tab bar (Today / Stats)
    index.tsx           # Today screen — check-in + streak
    stats.tsx           # Stats screen — streak, longest, 30-day grid
lib/
  AppContext.tsx        # App-wide state, hooks into storage
  storage.ts            # AsyncStorage wrapper
  date.ts               # Streak math + date key helpers
types/
  index.ts              # Nonnegotiable & CheckIn types
global.css              # Tailwind directives
tailwind.config.js      # NativeWind preset
```

## Get started

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android, or scan the QR in Expo Go.

## Design

This scaffold uses minimal neutral styling (greys + black) intentionally so Claude Design can layer a proper visual pass on top. Every screen's layout uses Tailwind utility classes via NativeWind — swap them freely.

## Data model

Stored in AsyncStorage under two keys:

- `@nonnegotiable/definition` → `{ projectName, action, why, createdAt }`
- `@nonnegotiable/checkIns` → `{ "YYYY-MM-DD": true, ... }`

## Streak rules

- A streak is an unbroken run of consecutive days marked done.
- If today isn't checked yet, the streak counts back from yesterday (not broken — you still have until midnight).
- Miss a full past day and the streak resets to 0.

## Reset

There's a "Reset project" link at the bottom of the Today screen — clears the nonnegotiable and all check-ins, bouncing you back to setup.
