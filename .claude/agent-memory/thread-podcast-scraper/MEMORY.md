# Thread Podcast Scraper Memory

## Successful Patterns

### Reddit Thread Extraction
- Use `old.reddit.com` with `.json` suffix for reliable JSON access
- Full URL pattern: `https://old.reddit.com/r/SUBREDDIT/comments/ID/SLUG/.json`
- Custom User-Agent required: `Mozilla/5.0 (compatible; PodcastCurator/1.0)`
- Thread JSON can be large (400KB+), don't truncate with `head`
- Comments are nested in `data.children` and `data.replies` structures

### HackerNews Thread Extraction
- Use Firebase API: `https://hacker-news.firebaseio.com/v0/item/{id}.json`
- Top-level item contains `kids` array (comment IDs)
- Recursively fetch each comment and its `kids` to build full tree
- Rate limiting: add 50-100ms delay between requests
- Thread metadata in root item: `title`, `text`, `by`, `descendants` (total comment count)
- Comments have: `id`, `by`, `text`, `kids` (nested replies)
- HTML entities in text: `&#x27;` → `'`, `&#x2F;` → `/`, `&quot;` → `"`

### Podcast Name Extraction
- ALWAYS convert HTML to clean plaintext FIRST before extracting names
- Never try to extract podcast names from raw HTML using regex
- Common HTML entities in Reddit threads: `&amp;` → `&`, `&#39;` → `'`
- Podcast mentions appear as:
  - Direct: "I recommend X"
  - Lists: "My favorites: X, Y, Z"
  - Descriptions: "that NPR show about..."
  - Abbreviated: "TAL" → This American Life
  - With context: "Joe Rogan's podcast" → The Joe Rogan Experience

### iTunes API
- Endpoint: `https://itunes.apple.com/search?term=QUERY&media=podcast&entity=podcast&limit=5`
- Rate limit: ~65 queries before HTTP 429 (observed Feb 2026, varies by time/IP)
- Lookup by ID: `https://itunes.apple.com/lookup?id=ITUNES_ID`
- Response fields:
  - `collectionName` → title
  - `artistName` → author
  - `feedUrl` → feed_url
  - `collectionId` → itunes_id
  - `artworkUrl600` → artwork_url (prefer 600x600)
- **iTunes does NOT return podcast descriptions** — must extract from RSS feed
- **Rate limit mitigation**: Use PodcastIndex as fallback, or implement manual additions for remaining podcasts

### PodcastIndex API
- Requires SHA-1 auth: `hash(API_KEY + API_SECRET + UNIX_TIMESTAMP)`
- Headers: `X-Auth-Key`, `X-Auth-Date`, `Authorization`, `User-Agent`
- Search endpoint: `https://api.podcastindex.org/api/1.0/search/byterm?q=QUERY`
- More lenient than iTunes, good fallback
- Response fields: `title`, `author`, `url` (feed), `itunesId`, `artwork`
- **PodcastIndex DOES return descriptions** — use `description` field

### RSS Feed Validation (MANDATORY)
- Must verify feed responds with 200 OK
- Must contain `<rss>` or `<feed>` root element
- Must contain at least 1 `<item>` with `<enclosure>` tag
- Use SSL context with `check_hostname=False` for dev (allows self-signed certs)
- Timeout: 15 seconds for feed fetches
- Episode count detection: count `<enclosure>` tags in feed
- **Primary description source**: Extract from RSS feed's `<description>` or `<itunes:summary>` tag in `<channel>` element
  - Look for both tags, prefer the longer one
  - Strip HTML tags from description text
  - Fallback to iTunes/PodcastIndex `description` if RSS extraction fails

### iTunes Match Verification (CRITICAL)
- NEVER blindly accept top iTunes result
- Compare search term against `collectionName` (case-insensitive, ignore "the"/"podcast")
- Check if key words appear in result (words > 3 chars)
- Example failure: searching "I would add the" → returns "iFindCheaters" (WRONG)
- Always verify the result makes sense

### Source Cross-Reference
- Every podcast title must appear in source page (case-insensitive)
- Decode HTML entities before matching (`html.unescape()`)
- Try multiple variations: full title, without "podcast", without "the", key words only
- **iTunes titles often include subtitles** (e.g., "Comedy Bang Bang: The Podcast" vs "Comedy Bang Bang")
  - Remove everything after `:` (subtitle)
  - Remove `with [hosts]` suffix
  - Compare cleaned title against source and original extraction list
- Missing from source = extraction error, exclude from output

### Deduplication
- Check `feed_url` uniqueness (primary key)
- Check `itunes_id` uniqueness (secondary, allow multiple 0s)
- Check `title` uniqueness (case-insensitive)
- Run dedup as final pass before Supabase insert

## Supabase Integration

### Configuration
- URL: from `.env` file `SUPABASE_URL`
- Service Key: from `.env` file `SUPABASE_SERVICE_KEY`
- Endpoint: `{SUPABASE_URL}/rest/v1/curated_articles`
- Headers: `apikey`, `Authorization: Bearer`, `Content-Type: application/json`, `Prefer: return=representation`

### Insert Requirements
- Exactly 1 row per invocation
- Check for duplicates first (query by title)
- Delete existing rows with same title before inserting
- Required fields:
  - `title` - creative, magazine-quality title
  - `description` - 2-3 engaging sentences referencing source themes
  - `content_type` - always `'podcast'` (not 'episode')
  - `is_published` - always `true`
  - `podcasts` - JSON array of podcast objects

### Podcast Object Schema
```json
{
  "title": "Podcast Name",
  "author": "Author or Host Name",
  "feed_url": "https://example.com/feed.rss",
  "itunes_id": 1234567890,
  "artwork_url": "https://example.com/artwork.jpg",
  "description": "The podcast's about/summary blurb for display to users."
}
```
- All fields must be non-empty strings (except itunes_id which can be 0)
- `description` field is MANDATORY (primary source: RSS feed, fallback: PodcastIndex/iTunes API)
- No `source` field in final output (internal use only)

## Common Pitfalls

### Extraction
- ❌ Trying to parse podcast names from raw HTML → garbage results
- ✓ Convert to plaintext first, then extract

### Validation
- ❌ Accepting first iTunes result without verification → wrong podcasts
- ✓ Always compare search term to result

### Source Cross-Reference
- ❌ Forgetting HTML entity decoding → false negatives
- ✓ Use `html.unescape()` before matching

### Supabase
- ❌ Inserting multiple rows → violates single-insert rule
- ✓ Always insert exactly 1 row, delete duplicates first

## Performance Stats (Feb 2026 runs)

### Run 1: Skateboarding thread (195 comments)
- Thread: 195 comments, 118 podcasts mentioned
- Validation success: 100% (118/118)
- RSS feed validation: 100% (118/118 valid)
- iTunes API success: 96.6% (114/118)
- PodcastIndex fallback: 4 podcasts
- Final count: 117 (1 duplicate removed)
- Processing time: ~5 minutes

### Run 2: Mind-bending WTF thread (184 comments)
- Thread: 184 comments, 77 podcasts mentioned
- Validation success: 97.4% (75/77 found)
- RSS feed validation: 100% (75/75 valid)
- iTunes API success: 79.2% (61/77)
- PodcastIndex fallback: 11 podcasts
- Manual fixes: 3 podcasts
- Failed to find: 2 (Bigipedia, Getting On with James Urbaniak)
- Final count: 75 (0 duplicates)
- Processing time: ~4 minutes

### Run 3: Long-running quality podcasts thread (195 comments, 83 top-level) — REPLACED BY RUN 6
- (Superseded by more comprehensive Run 6 below)

### Run 6: Long-running quality podcasts thread (202 comments) — CURRENT
- Source: https://www.reddit.com/r/podcasts/comments/1q70tmo/which_longrunning_podcasts_are_still_as_great_as/
- Thread: 202 comments, 84 podcasts mentioned
- Validation success: 100% (84/84 found)
- RSS feed validation: 100% (84/84 valid)
- iTunes API success: 97.6% (82/84) — hit rate limit after ~65 queries
- PodcastIndex fallback: 0 podcasts (not needed)
- Manual additions: 2 (QAnon Anonymous, PseudoPod)
- Description extraction: 98.8% (83/84 from RSS feeds)
- Final count: 84 (0 duplicates)
- Processing time: ~10 minutes
- Supabase ID: 98ef393f-f8a0-489f-b8da-a60c05bb9cf3
- Title: "Timeless Excellence: Long-Running Podcasts That Never Lost Their Edge"
- Note: Special character handling for "Conspìritors" → "The Conspirators"

### Run 4: TIME Magazine "100 Best Podcasts" (curated listicle)
- Source: https://time.com/collections/100-best-podcasts/
- Extraction: 50 podcasts visible in HTML (remaining 50 require dynamic loading)
- Validation success: 98% (49/50)
- RSS feed validation: 98% (49/50 valid)
- iTunes API success: 94% (47/50)
- PodcastIndex fallback: 2 podcasts
- Failed: 1 podcast (Homecoming - invalid RSS feed)
- Final count: 49 (0 duplicates)
- Processing time: ~8 minutes
- Supabase ID: e8178b91-df9c-44a9-b5c0-5440a7b62697
- Note: TIME page uses dynamic content loading; only first 50 podcasts accessible via HTML scraping

### Run 5: Audio drama recommendations (large-scale extraction)
- Source: https://www.reddit.com/r/audiodrama/comments/1pt3gvt/recommendations/
- Thread: 846 lines of comments, 167 unique audio drama podcasts extracted
- Validation success: 97.0% (162/167 automated + 3 manual)
- RSS feed validation: 100% (162/162 valid)
- iTunes API success: 76.6% (124/162) — hit rate limit after ~150 queries
- PodcastIndex fallback: 23.5% (38/162)
- Manual additions: 3 (Borasca→Borrasca, Eos10→EOS 10, Decoder Ring Theatre)
- Deduplication: 3 duplicates removed (Woodbine, LifeAfter, The Left Right Game variants)
- Final count: 161 (1 excluded for missing description)
- Processing time: ~10 minutes
- Supabase ID: d1007856-39d7-4c44-be73-e7c2dcee5f66
- Title: "Tales in the Dark: Essential Audio Drama Podcasts That Will Transport You"
- Note: Spelling variants critical for audio dramas (Borasca/Borrasca, Eos10/EOS 10)

### Run 6: Nicholas Quah narrative podcasts (curated listicle)
- Source: https://www.yearendlists.com/2025/nicholas-quah-10-narrative-podcasts-we-loved-this-year
- Source type: Year-end list aggregator, simple bullet list
- Podcasts extracted: 10 (complete list)
- Validation success: 100% (10/10)
- RSS feed validation: 100% (10/10 valid)
- iTunes API success: 100% (10/10)
- PodcastIndex fallback: 0 (not needed)
- Final count: 10 (0 duplicates)
- Processing time: ~3 minutes
- Supabase ID: 459f37fb-a331-4c98-94ef-211056ed0436
- Title: "Storytelling at Its Finest: Nicholas Quah's Essential Narrative Podcasts of 2025"
- Note: Clean extraction from simple list format, all podcasts well-known with stable feeds

### Run 8: Left-wing podcasts thread (198 comments)
- Source: https://www.reddit.com/r/podcasts/comments/1ljnfi2/left_wing_podcasts/
- Thread: 198 comments, 38 podcasts mentioned
- Validation success: 89.5% (34/38)
- RSS feed validation: 34/34 valid (lenient regex parsing saved several malformed feeds)
- iTunes API success: ~30 requests before rate limit hit
- PodcastIndex fallback: ~12 podcasts
- Failed to find: 4 (5-4 - dead feed, Deconstructed - dead feed, QAnon Anonymous - extraction oversight, House of Pod - no valid entry)
- Description extraction: 100% (34/34 from RSS feeds using regex)
- Final count: 34 (1 duplicate removed, 1 false positive removed)
- Processing time: ~10 minutes
- Supabase ID: 284c9391-2c48-457c-9ba3-27abca97f2fc
- Title: "The Progressive Podcast Arsenal: Essential Listening for the Modern Left"
- **Key learning**: Lenient regex-based RSS parsing is CRITICAL for malformed feeds (NPR, Acast, Audioboom feeds all failed strict XML parsing but worked with regex)

### Run 10: Scariest podcasts Reddit thread (200 comments)
- Source: https://www.reddit.com/r/podcasts/comments/1ra0q1i/i_want_the_scariest_podcasts_you_have_ever_heard/
- Thread: 200 comments, 83 podcasts mentioned (horror, true crime, paranormal, audio drama)
- Validation success: 100% (63/63 in final list)
- RSS feed validation: 100% (63/63 valid)
- iTunes API success: ~30% (rate limited early, used batch lookup for artwork)
- PodcastIndex fallback: 70% of artwork and many feed lookups
- Failed feeds fixed: 9 (Casefile, Magnus Archives, Monsters Among Us, Penny Royal, Cabinet of Curiosities, Hidden Djinn, Limetown, Relatos de la Noche, It Could Happen Here — all needed alternate feed URLs)
- Excluded: Relatos De La Noche (eventually fixed), some without feed episodes or descriptions
- Final count: 63 (0 duplicates)
- Processing time: ~15 minutes
- Supabase ID: 61e06d6a-2408-430f-90b8-05d1474bcf09
- Title: "Nightmare Fuel: The Scariest Podcasts Guaranteed to Keep You Up at Night"
- **Key learning**: Acast feed URLs from iTunes search often stale — use `audioboom.com/channels/ID.rss` or `rss.acast.com/SLUG` patterns instead
- **Key learning**: Artwork batch lookup via iTunes `?id=X,Y,Z` only returns ~17 at a time (rate limit), use PodcastIndex `byitunesid` endpoint as reliable fallback
- **Key learning**: `It's Haunted...What Now?` found in PodcastIndex but not iTunes (no apostrophe searches work)
- **Key learning**: BBC feeds use `podcasts.files.bbci.co.uk/SLUG.rss` pattern (very reliable)

### Run 7: The Atlantic's 20 Best Podcasts of 2025 (curated listicle)
- Source: https://www.theatlantic.com/culture/2025/12/20-best-podcasts-2025/685010/
- Source type: Professional media outlet, year-end list
- Podcasts extracted: 20 (complete list)
- Validation success: 100% (20/20)
- RSS feed validation: 100% (20/20 valid — **WebFetch critical for XML parsing failures**)
- iTunes API success: 90% (18/20)
- Audible Original: 1 (Fela Kuti: Fear No Man, itunes_id set to 0)
- **WebFetch RSS validation saved 7 podcasts** that failed standard XML parsing (art19.com, audioboom.com, cbc.ca feeds)
- Final count: 20 (0 duplicates)
- Processing time: ~15 minutes
- Supabase ID: 6198c08f-d567-4500-9813-2e901f21dc1a
- Title: "The Atlantic's 20 Best Podcasts of 2025: Essential Listening"
- **CRITICAL LESSON**: When `ET.fromstring()` fails on RSS feeds, use WebFetch to parse them — it handles malformed HTML entities and CDATA issues that crash standard XML parsers

### Run 9: HackerNews "Best Podcasts of 2025" thread (68 comments)
- Source: https://news.ycombinator.com/item?id=46411500
- Thread: 68 comments (41 top-level trees), fetched via HN Firebase API
- Podcasts extracted: 99 unique podcasts
- Validation success: 99% (98/99) — 1 paywalled (Stratechery)
- RSS feed validation: 100% (98/98 valid)
- iTunes API success: 60/98 (hit rate limit after ~65 queries)
- PodcastIndex fallback: 30 podcasts
- Manual WebSearch additions: 8 podcasts (Buzzsprout feeds required User-Agent header)
- Source cross-reference: 94/98 verified (4 false positives from iTunes mismatches)
- Deduplication: 2 duplicates removed ("The Rest Is Politics", "Dwarkesh Podcast")
- Final count: 92 (0 duplicates, all verified)
- Processing time: ~10 minutes
- Supabase ID: 0e3d7652-5a4b-466c-a1ac-51156ee2975f
- Title: "Hacker News Favorites: The Podcasts Tech Leaders Are Listening To in 2025"
- **HN API pattern**: `https://hacker-news.firebaseio.com/v0/item/{id}.json` for posts/comments
- **Buzzsprout feeds**: Require `User-Agent: Mozilla/5.0 (compatible; PodcastCurator/1.0)` header or return 403

## Title/Description Examples

Good titles:
- "Brain Food: The Podcasts That Will Make You Think Harder"
- "Down the Rabbit Hole: True Crime Podcasts That Will Keep You Up at Night"
- "Board Talk: The Podcasts Every Skater Should Be Listening To"
- "Reality Unraveled: Mind-Bending Podcasts That Defy Logic and Stretch Your Imagination"
- "Timeless Excellence: Long-Running Podcasts That Never Lost Their Edge"

Bad titles:
- "Podcasts from Reddit Thread"
- "Smart Podcasts List"
- "Podcast Recommendations"

## Edge Cases Encountered

### Incorrect API Results
- "Redacted News" returned for search "Redacted" → wrong podcast
  - Correct: "REDACTED: Declassified Mysteries with Luke Lamana" by Wondery
  - Solution: Use WebSearch to verify context, then lookup by iTunes ID
- "Umwelt und Verbraucher" (German podcast) returned for "Umwelt"
  - Correct: "Umwelt" by Ryan Pemberton (about animals)
  - Solution: Check episode descriptions or use context from thread

### BBC/Regional Podcasts
- BBC podcasts (Bigipedia, The Sink) not always in iTunes/PodcastIndex
- Some are region-locked or only on BBC Sounds
- Solution: Try alternate search terms or accept as unavailable

### Defunct Podcasts
- Some podcasts mentioned in threads are no longer available
- "Getting On with James Urbaniak" - not found in any directory
- "Homecoming" (Gimlet) - found in iTunes but RSS feed invalid/no episodes
- Solution: Log as not found, don't include in output

### Dynamic Content Pages
- TIME Magazine collection page loads only 50 of 100 podcasts in initial HTML
- Individual podcast pages exist with predictable ID pattern (7303040-7303139)
- But pages aren't interlinked or accessible via pagination/sitemap
- Solution for complete extraction: use browser automation (Selenium/Playwright) or manually fetch by ID range
- For curated lists: acceptable to work with accessible subset if it represents quality content
