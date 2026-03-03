# SPI-76: Audio Fails to Play When Swiping During Race

**Overall Progress:** `100%`

## TLDR
When user swipes up before the preload race completes, the animation finishes and calls `startPendingAudio()` before the async Task has set up the pending audio. Fix by calling `startPendingAudio()` in the Task after the episode is played.

## Critical Decisions
- **Fix location**: Add `startPendingAudio()` call at end of async Task block in `nextEpisode()` - single point of change
- **Idempotency**: Safe to call `startPendingAudio()` twice (it returns early if `pendingAudioURL` is nil)
- **No behavioral changes**: Placeholder/shimmer already works correctly during race wait

## Tasks

- [x] 🟩 **Step 1: Fix async Task audio start in PlayerViewModel**
  - [x] 🟩 In `nextEpisode()` (around line 1358-1367), add `startPendingAudio()` call after race wait/fallback completes
  - [x] 🟩 Only call when `deferAudioStart` is true

- [ ] 🟥 **Step 2: Test the fix (manual)**
  - [ ] 🟥 Swipe up during active race → audio should play after race completes
  - [ ] 🟥 Swipe up when preload is ready → audio should play immediately (no regression)
  - [ ] 🟥 Swipe up when no preload exists → fresh episode loads and plays (no regression)
