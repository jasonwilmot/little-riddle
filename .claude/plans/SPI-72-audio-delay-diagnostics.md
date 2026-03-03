# SPI-72: Audio Playback Delay Diagnostics

**Overall Progress:** `83%`

## TLDR
Add diagnostic logging to trace why audio takes 20-30 seconds to play after swiping up, despite race preload showing a winner. We need to see exactly what happens between "race winner stored" → "user swipes" → "audio plays" to identify if the preloaded player's status has degraded.

## Critical Decisions
- **Logging only, no logic changes** - We need to confirm root cause before fixing
- **Use `[stumble][diag]` prefix** - Easy to filter in Xcode console and remove later
- **Log buffer state** - Track `loadedTimeRanges`, `isPlaybackLikelyToKeepUp`, `isPlaybackBufferEmpty` to see if iOS evicted buffers
- **Log polling iterations** - See how long status polling takes when preload isn't ready
- **START/END markers** - Easy to copy diagnostic block for troubleshooting

## Hypothesis to Validate
The preloaded AVPlayer's status degrades from `.readyToPlay` to `.unknown` between race completion and swipe, causing the code to enter `startStatusPolling()` instead of instant playback. This is more likely on older iPhones due to memory pressure.

## Tasks

- [x] 🟩 **Step 1: Add entry diagnostics to `play()`**
  - [x] 🟩 Log preloadedPlayers count and keys at function entry
  - [x] 🟩 Log whether URL key match was found

- [x] 🟩 **Step 2: Add preload inspection logging**
  - [x] 🟩 When preload found: log item.status, duration, buffer state
  - [x] 🟩 Log loadedTimeRanges to see what's actually buffered
  - [x] 🟩 Log which code path executes (instant vs polling)

- [x] 🟩 **Step 3: Add "no preload" diagnostic**
  - [x] 🟩 Log when no preload exists and new AVPlayerItem is created

- [x] 🟩 **Step 4: Enhance `startStatusPolling()` logging**
  - [x] 🟩 Add poll counter and elapsed time tracking
  - [x] 🟩 Log first poll and every 5 seconds (poll #50, #100, etc.)
  - [x] 🟩 Log buffer state during polling
  - [x] 🟩 Log final result (ready/failed) with total time

- [x] 🟩 **Step 5: Add `handlePlayerReady()` entry log**
  - [x] 🟩 Confirm when playback actually starts
  - [x] 🟩 Add START/END markers for easy copy-paste

- [ ] 🟥 **Step 6: Test and reproduce**
  - [ ] 🟥 Build and run on older iPhone via Xcode
  - [ ] 🟥 Swipe up repeatedly until delay occurs
  - [ ] 🟥 Capture console logs showing the diagnostic trace

## Files Modified
- `PodRadio/Services/Audio/AudioService.swift` - All diagnostic logging added

## Build Status
✅ **Build succeeded** on iOS Simulator (iPhone 17)

## How to Filter Logs in Xcode
In the Xcode console, filter by: `[stumble][diag]`

## Expected Diagnostic Output

### Happy Path (preload works):
```
[stumble][diag] ═══════════ START DIAGNOSTIC ═══════════
[stumble][diag] play() called for: [up] Episode Title
[stumble][diag] URL: ...last80chars...
[stumble][diag] preloadedPlayers count: 1
[stumble][diag] preloadedPlayers keys: ["episode.mp3"]
[stumble][diag] Looking for key match: true
[stumble][diag] ✓ Preloaded player FOUND
[stumble][diag]   item.status: 1 (0=unknown, 1=readyToPlay, 2=failed)
[stumble][diag]   item.duration: 3600.0
[stumble][diag]   isPlaybackLikelyToKeepUp: true
[stumble][diag]   isPlaybackBufferEmpty: false
[stumble][diag]   loadedTimeRanges: ["300-330s"]
[stumble][diag] → PATH: Instant playback (preload ready)
[stumble][diag] Instant playback started (no polling needed)
[stumble][diag] ════════════ END DIAGNOSTIC ════════════
```

### Bug Case (status degraded):
```
[stumble][diag] ═══════════ START DIAGNOSTIC ═══════════
[stumble][diag] play() called for: [up] Episode Title
[stumble][diag] URL: ...last80chars...
[stumble][diag] preloadedPlayers count: 1
[stumble][diag] preloadedPlayers keys: ["episode.mp3"]
[stumble][diag] Looking for key match: true
[stumble][diag] ✓ Preloaded player FOUND
[stumble][diag]   item.status: 0 (0=unknown, 1=readyToPlay, 2=failed)  ← BUG
[stumble][diag]   item.duration: nan
[stumble][diag]   isPlaybackLikelyToKeepUp: false
[stumble][diag]   isPlaybackBufferEmpty: true
[stumble][diag]   loadedTimeRanges: EMPTY  ← Buffer evicted
[stumble][diag] → PATH: Waiting for partial preload (status polling)
[stumble][diag] Status polling: still .unknown (poll #1, 0.1s elapsed)
[stumble][diag]   isPlaybackLikelyToKeepUp: false
[stumble][diag]   isPlaybackBufferEmpty: true
[stumble][diag]   loadedTimeRanges: EMPTY
... (20-30 seconds of polling)
[stumble][diag] Status polling: still .unknown (poll #50, 5.0s elapsed)
[stumble][diag] Status polling: still .unknown (poll #100, 10.0s elapsed)
[stumble][diag] Status polling: READY after 250 polls (25.0s)
[stumble][diag] handlePlayerReady() - starting playback
[stumble][diag] ════════════ END DIAGNOSTIC ════════════
```

## Next Steps (after diagnostics confirm root cause)
- If status degradation confirmed: Add preload health monitoring + refresh
- If URL mismatch: Fix key normalization
- If AVAudioSession issue: Add session activation in play()
