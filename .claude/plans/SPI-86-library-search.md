# SPI-86: Add Search/Filter to Library Page

**Overall Progress:** `100%`

## TLDR
Add a native SwiftUI search bar to the Library page that filters podcasts by title (case-insensitive, activates at 3+ characters). Categories with zero matching podcasts are hidden. During active search, hide New Category, Random, and Restore Defaults sections to keep results clean. Search works offline.

## Critical Decisions
- **Search scope:** Title only — no author matching
- **Activation threshold:** 3+ characters before filtering kicks in
- **UI during search:** Hide New Category section, Random category row, and Restore Defaults — show only matching categories/podcasts
- **Offline:** Search bar always visible — it's local filtering, no network needed
- **Approach:** `.searchable(text:)` modifier on the List — first use in the codebase, native iOS pattern

## Tasks

- [x] 🟩 **Step 1: Add search state and `.searchable()` modifier**
  - [x] 🟩 Add `@State private var searchText = ""` to LibraryView
  - [x] 🟩 Add `.searchable(text: $searchText, prompt: "Search podcasts")` modifier to the List

- [x] 🟩 **Step 2: Add computed property for active search detection**
  - [x] 🟩 Add `private var isSearchActive: Bool` computed property (`searchText.count >= 3`)

- [x] 🟩 **Step 3: Add filtered categories computed property**
  - [x] 🟩 Create `private var filteredCategories: [PodCategory]` that wraps `sortedCategories`
  - [x] 🟩 When `isSearchActive`, filter each category to only include those where at least one podcast title matches via `localizedCaseInsensitiveContains`
  - [x] 🟩 When not searching, return `sortedCategories` unchanged

- [x] 🟩 **Step 4: Add filtered podcasts helper**
  - [x] 🟩 Create `private func filteredPodcasts(for category: PodCategory) -> [Podcast]` that returns `category.podcasts.sorted(by: { $0.title < $1.title })` filtered by search text when active, unfiltered otherwise

- [x] 🟩 **Step 5: Update `libraryContent` to use filtered data and hide sections during search**
  - [x] 🟩 Wrap `newPodCategorySection` in `if !isSearchActive` (in addition to existing offline check)
  - [x] 🟩 Wrap Random category section in `if !isSearchActive`
  - [x] 🟩 Replace `sortedCategories` with `filteredCategories` in the ForEach
  - [x] 🟩 Replace inline `category.podcasts.sorted(...)` with `filteredPodcasts(for: category)` in the inner ForEach
  - [x] 🟩 Wrap `restoreDefaultsSection` in `if !isSearchActive`

- [x] 🟩 **Step 6: Verify and test**
  - [x] 🟩 Build succeeds with no warnings
  - [ ] 🟥 Confirm: typing < 3 chars shows full library
  - [ ] 🟥 Confirm: typing 3+ chars filters podcasts and hides empty categories
  - [ ] 🟥 Confirm: New Category, Random, Restore Defaults hidden during search
  - [ ] 🟥 Confirm: clearing search restores full library
  - [ ] 🟥 Confirm: search bar visible when offline
