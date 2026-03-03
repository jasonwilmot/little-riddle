# SPI-78: Category Switch Consistency

**Overall Progress:** `100%`

## TLDR
Category switch should behave exactly like swipe up: stop current audio and always show all icons (no layout shift).

## Critical Decisions
- **Follow `nextEpisode()` pattern**: Add `preserveCurrentPlayerForPreload()` to `jumpToCategory()` to stop audio
- **Always show icons**: Remove conditional rendering of share icon - show disabled state instead
- **Clear pending audio**: Prevent stale pending audio from previous action playing wrong episode
- **Guard time observer**: Prevent scrubber jumping to 0 during seek

## Tasks

- [x] 🟩 **Step 1: Stop audio on category switch**
  - [x] 🟩 In `jumpToCategory()`, add `preserveCurrentPlayerForPreload()` call before race starts

- [x] 🟩 **Step 2: Always show share icon**
  - [x] 🟩 In `controlsView`, always render share icon (grayed out when no episode)

- [x] 🟩 **Step 3: Fix wrong episode playing on category switch**
  - [x] 🟩 Clear pending audio state in `jumpToCategory()` to prevent stale audio from previous action

- [x] 🟩 **Step 4: Fix scrubber jumping to 0**
  - [x] 🟩 Guard time observers to not overwrite expected position with stale player position (< 1s)
