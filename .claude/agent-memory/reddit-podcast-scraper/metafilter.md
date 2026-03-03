# MetaFilter Scraping Notes

## HTML Structure
- Comments are in divs: `<div class="comments" id="c{id}">...content...</div><br><br>`
- Each comment has an anchor before it: `<a name="{id}"></a>`
- Links within comments: `<a href="url">link_text</a>`
- Must use `unescape()` from html module to properly decode HTML entities like `&quot;`

## Extraction Challenges
- Podcast names often appear before links with patterns like:
  - "Podcast Name, episode 'title'"
  - "Podcast Name - Episode Title"
  - "Podcast Name: Episode Title"
- Many comments have multiple podcast recommendations separated by `<br>` tags
- Need to parse each link individually, not try to group multi-line entries
- Common false positives: "I find", "I would add", "though this", "For the laughs"

## MetaFilter-Specific Patterns
- Users often link directly to episode pages (not just podcast homepages)
- Common domains: gimletmedia.com, thisamericanlife.org, wnycstudios.org, 99percentinvisible.org
- Link text often contains episode title, not podcast name
- Podcast name usually appears in the text before the link

## iTunes API Success Rate
- Works well for major podcasts (This American Life, Radiolab, Heavyweight, etc.)
- Returns wrong matches when podcast name extraction is poor
- Better to be conservative in name extraction than to get false positives

## RSS Feed Matching
- Episode title matching is fuzzy but generally works
- Many feeds only have recent episodes (not full archives)
- Falls back to most recent episode when specific match not found

## Validation Results
- MetaFilter thread 351402: 72 mentions, 45 validated (62% success rate)
- Main failure reasons:
  - Poor podcast name extraction (leading to wrong iTunes lookups)
  - Audio validation failures
  - Missing episodes in RSS feeds (older episodes)

## Improvements Needed
- Better podcast name regex to avoid capturing sentence fragments
- Use URL analysis more heavily (domain-to-podcast mapping)
- Manual mapping for known podcast hosting patterns
