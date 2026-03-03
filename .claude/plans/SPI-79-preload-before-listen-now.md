# SPI-79: Preload Next Episode Before Enabling Listen Now

**Overall Progress:** `80%`

## TLDR
Preload the UP direction episode **before** enabling the "Listen Now" button, so if the user swipes up immediately after first play, there's no loading delay.

## Critical Decisions
- **Same race strategy as current UP preload**: Use `racePreload` with 2 candidates, first to buffer wins
- **Exclude initial episode's podcast**: UP preload should pick from different podcast for variety
- **User waits for both**: Button stays disabled until initial + UP preloads are ready
- **Don't touch LEFT/RIGHT**: They're disabled but leave code intact

## Files Modified
- `PodRadio/ViewModels/PlayerViewModel.swift`

## Tasks

- [x] 🟩 **Step 1: Add exclusion parameter to pick functions**
  - [x] 🟩 Modify `pickTwoEpisodesForUpPreload()` to accept optional `excludingFeedURL: String?` parameter (line ~1625)
  - [x] 🟩 When provided, use it instead of `currentEpisode?.podcast?.feedURL` for first candidate exclusion
  - [x] 🟩 Default to existing behavior when nil

- [x] 🟩 **Step 2: Add exclusion parameter to race functions**
  - [x] 🟩 Modify `triggerUpPreloadWithRacing()` to accept optional `excludingFeedURL: String?` parameter (line ~1941)
  - [x] 🟩 Modify `raceUpPreload()` to accept and pass through `excludingFeedURL` (line ~2014)
  - [x] 🟩 Thread the parameter down to `pickTwoEpisodesForUpPreload()`

- [x] 🟩 **Step 3: Trigger UP preload during initial load**
  - [x] 🟩 In `preloadInitialEpisode()`, after starting initial audio preload:
    - Call `triggerUpPreloadWithRacing(excludingFeedURL: episode.podcast?.feedURL)`
  - [x] 🟩 Add wait loop for UP preload readiness (poll `isUpPreloadReady`, same 10s timeout)
  - [x] 🟩 Only set `isReadyToPlay = true` after BOTH initial and UP preloads are ready

- [x] 🟩 **Step 4: Update turnOnRadio to skip redundant preload**
  - [x] 🟩 In `turnOnRadio()`, check if UP preload already exists before calling `triggerPreloads()`
  - [x] 🟩 Add `skipUp: Bool` parameter to `triggerPreloads()` and `triggerVerticalPreloads()`
  - [x] 🟩 If `preloadedUpEpisode != nil`, pass `skipUp: true` to avoid redundant preload

- [ ] 🟥 **Step 5: Test and verify**
  - [ ] 🟥 Verify button stays disabled while both preloads load
  - [ ] 🟥 Verify swipe up immediately after Listen Now uses preloaded episode (green indicator visible)
  - [ ] 🟥 Verify UP preload excludes initial episode's podcast
  - [ ] 🟥 Verify no regressions in normal swipe-up flow after initial play

## Implementation Notes

### Current flow:
```
loadPodcasts() → preloadInitialEpisode() → isReadyToPlay=true
turnOnRadio() → playEpisode() → triggerPreloads() → UP preload starts
```

### New flow:
```
loadPodcasts() → preloadInitialEpisode() → triggerUpPreload() → wait for both → isReadyToPlay=true
turnOnRadio() → playEpisode() → triggerPreloads(skipUp: true)
```

### Changes made:
1. `pickTwoEpisodesForUpPreload(excludingFeedURL: String? = nil)` - uses provided URL or falls back to currentEpisode
2. `triggerUpPreloadWithRacing(excludingFeedURL: String? = nil)` - passes exclusion to race function
3. `raceUpPreload(attempt:generation:excludingFeedURL:)` - passes exclusion to pick function
4. `preloadInitialEpisode()` - now triggers UP preload and waits for both before enabling button
5. `triggerPreloads(skipUp: Bool = false)` - can skip UP preload
6. `triggerVerticalPreloads(skipUp: Bool = false, skipDown: Bool = false)` - handles both skip options
7. `turnOnRadio()` - passes skipUp: true if UP is already preloaded

### Build Status
✅ Build succeeded on iPhone 17 simulator
