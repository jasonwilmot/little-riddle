# SPI-75: Swipe Animation Stutters Fix

**Overall Progress:** `100%` ✅

## TLDR
Audio starts during swipe animation (while screen is black), causing janky UX. Fix: defer `audioService.play()` until slide-in animation completes using iOS 17+ `withAnimation` completion handler.

## Critical Decisions
- **Completion handler over asyncAfter**: Using iOS 17+ `withAnimation` completion API for precise timing instead of guessed delays
- **Sound effect unchanged**: Tuning sound should still play immediately on swipe (current behavior is correct)
- **State updates still immediate**: Only `audioService.play()` is deferred; episode state/UI updates happen during animation

## Tasks:

- [x] 🟩 **Step 1: Add Deferred Audio Support to PlayerViewModel**
  - [x] 🟩 Add pending audio properties (`pendingAudioURL`, `pendingAudioSeekTime`, `pendingAudioDuration`, `pendingAudioLogTag`)
  - [x] 🟩 Add `deferAudioStart: Bool = false` parameter to `playEpisode()`
  - [x] 🟩 Implement conditional logic: store pending info when deferred, call `audioService.play()` when not
  - [x] 🟩 Add `startPendingAudio()` public method
  - [x] 🟩 Add `deferAudioStart` parameter to `nextEpisode()` and pass through to `playEpisode()`
  - [x] 🟩 Add `deferAudioStart` parameter to `nextCategory()`, `previousCategory()`, `previousEpisode()`, `jumpToCategory()`
  - [x] 🟩 Update `playFreshEpisode()`, `waitForRaceOrUseCandidate()`, `playRandomFromCurrentCategory()`, `raceAndPlayEpisode()`, `raceEpisodeAttempt()` to pass through `deferAudioStart`

- [x] 🟩 **Step 2: Use Animation Completion in NowPlayingView**
  - [x] 🟩 Add `onAnimationComplete: @escaping () -> Void` parameter to `performEpisodeChange()`
  - [x] 🟩 Replace slide-in `withAnimation` with completion handler version
  - [x] 🟩 Add `onAnimationComplete` parameter to `performCategoryChange()`
  - [x] 🟩 Update `handleVerticalSwipe()` call site - pass `deferAudioStart: true` and completion closure
  - [x] 🟩 Update `artworkWithNavigation()` arrow button call sites
  - [x] 🟩 Update `handleCategoryPickerDismiss()` call site

- [x] 🟩 **Step 3: Test & Verify**
  - [x] 🟩 Build succeeds on simulator
  - [x] 🟩 Verify swipe-up animation is smooth on device
  - [x] 🟩 Verify audio starts only after slide-in completes
  - [x] 🟩 Verify sound effect still plays immediately
  - [x] 🟩 Test arrow button taps
  - [x] 🟩 Test category picker selection
