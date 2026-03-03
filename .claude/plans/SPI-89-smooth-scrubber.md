# Feature Implementation Plan

**Overall Progress:** `75%`

## TLDR
The playback scrubber jitters because the live `currentTime` observer overwrites the user's drag position every 0.5s. Fix by intercepting the drag with local state, suppressing live updates while scrubbing, and seeking only on release.

## Critical Decisions
- **Scrub state lives in NowPlayingView as `@State`** — purely UI concern, no need to propagate to ViewModel or AudioService
- **Seek only on release** — no throttled seeking during drag; simplest fix, eliminates jitter entirely
- **Time label unchanged** — continues showing `viewModel.currentTime` during scrub (no extra scope)

## Tasks:

- [x] 🟩 **Step 1: Add local scrub state to NowPlayingView**
  - [x] 🟩 Add `@State private var isScrubbing: Bool = false`
  - [x] 🟩 Add `@State private var scrubValue: TimeInterval = 0`

- [x] 🟩 **Step 2: Rewire the Slider binding**
  - [x] 🟩 `get`: return `scrubValue` when `isScrubbing`, otherwise `viewModel.currentTime`
  - [x] 🟩 `set`: update `scrubValue` only — no seek call

- [x] 🟩 **Step 3: Add `onEditingChanged` handler to Slider**
  - [x] 🟩 When editing begins (`editing`): snapshot `viewModel.currentTime` into `scrubValue`, set `isScrubbing = true`
  - [x] 🟩 When editing ends (`!editing`): call `viewModel.seek(to: scrubValue)`, then set `isScrubbing = false`

- [ ] 🟨 **Step 4: Verify and test**
  - [x] 🟩 Build and confirm no compile errors
  - [ ] 🟥 Manual test: drag scrubber slowly — no jitter or snap-back
  - [ ] 🟥 Manual test: tap scrubber (instant seek) still works
  - [ ] 🟥 Manual test: scrubber resumes tracking live playback after release
