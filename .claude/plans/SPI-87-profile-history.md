# SPI-87: Profile History Section

**Overall Progress:** `100%`

## TLDR
Add a "History" section to ProfileView (between Subscription and About) showing the count of unique episode GUIDs the user has swiped through, with a "Clear" pill button that wipes all `PlayedEpisode` records after confirmation.

## Critical Decisions
- **Unique GUIDs only**: Count distinct `episodeGuid` values, not total `PlayedEpisode` records (which duplicate across categories)
- **Alert pattern**: Use `.alert()` consistent with existing codebase (not `.confirmationDialog`)
- **No side effects on clear**: Clearing records doesn't affect current playback state
- **Capsule pill style**: Match existing `Capsule()` button patterns used in LibraryView/NowPlayingView

## Tasks

- [x] 🟩 **Step 1: Add `clearAllPlayedEpisodes()` and `uniquePlayedEpisodeCount()` to PersistenceService**
  - [x] 🟩 Add `uniquePlayedEpisodeCount() -> Int` — fetches all `PlayedEpisode`, extracts unique `episodeGuid` values via `Set`, returns count
  - [x] 🟩 Add `clearAllPlayedEpisodes()` — deletes all `PlayedEpisode` records (no category filter)
  - File: `PodRadio/Services/Persistence/PersistenceService.swift`

- [x] 🟩 **Step 2: Add History section to ProfileView**
  - [x] 🟩 Add `@Environment(\.modelContext)` and derive `PersistenceService` (matches existing pattern)
  - [x] 🟩 Add `@State` for episode count and `showClearAlert` bool
  - [x] 🟩 Add History section between Subscription and About with:
    - Row: "Episodes Discovered" label + count on trailing side
    - "Clear" capsule pill button (destructive styling)
  - [x] 🟩 Add `.alert()` confirmation before clearing
  - [x] 🟩 Load count on `.onAppear` / refresh after clear
  - File: `PodRadio/Views/Profile/ProfileView.swift`

## Verification
- [x] Build the project with `xcodebuild` — **BUILD SUCCEEDED**
- [ ] Open Profile tab — History section visible between Subscription and About
- [ ] Count reflects unique episodes swiped through
- [ ] Tapping "Clear" shows confirmation alert
- [ ] Confirming clears count to 0
- [ ] Cancelling leaves count unchanged
- [ ] Current playback unaffected after clear
