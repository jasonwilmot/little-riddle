# Reddit Podcast Scraper Agent Memory

## Reddit JSON Structure
- **IMPORTANT**: Reddit blocks standard requests - must use `old.reddit.com` domain
- Append `.json` to any Reddit URL to get JSON data
- Required headers: `User-Agent: Mozilla/5.0...` and `Accept: application/json`
- Structure: `[post_data_object, comments_listing_object]`
- `reddit_data[1]['data']['children']` contains top-level comments
- Each comment has `kind: 't1'` and nested `replies` object
- Must recursively traverse replies to get all nested replies
- Total comment count includes all nested replies

## Reddit Podcast Mention Extraction
- People mention podcasts in 3 main patterns:
  1. `Podcast Name - Episode Title` or `Podcast Name: Episode Title`
  2. Standalone capitalized phrases (2-6 words, mostly capitalized)
  3. Quoted podcast names in "double quotes"
- Filter out common stop words and generic phrases
- Example: "Heavyweight - another roadside attraction" → podcast="Heavyweight", episode="another roadside attraction"
- Parse each line separately; some comments list multiple podcasts

## iTunes Podcast Search API
- Endpoint: `https://itunes.apple.com/search?term=PODCAST_NAME&media=podcast&entity=podcast`
- Returns up to 5 results (can specify limit)
- Each result has:
  - `collectionName`: Podcast title
  - `feedUrl`: RSS feed URL
  - `artworkUrl600`: High-res artwork (600x600)
  - `artworkUrl100`: Low-res fallback
- **Rate limit**: 429 errors after ~40-50 rapid requests
- **Solution**: Use 0.6s delays between requests, add retry logic with exponential backoff
- Works reliably for major podcasts
- **NEVER returns podcast descriptions** - only artwork and feed URL

## RSS Feed Parsing
- Common hosting platforms: Megaphone, Simplecast, Anchor, Omny, Art19
- iTunes namespace: `{http://www.itunes.com/dtds/podcast-1.0.dtd}`
- Key elements:
  - `<channel><title>`: Podcast title
  - `<item>`: Each episode
  - `<guid>`: Unique episode ID
  - `<enclosure url="">`: Audio file URL
  - `<itunes:duration>`: Can be "HH:MM:SS", "MM:SS", or seconds
  - `<pubDate>`: Format "Wed, 15 Nov 2023 12:00:00 GMT"
  - `<itunes:image href="">`: Artwork (episode or podcast level)
- Parse with ElementTree using full namespace URIs
- Max feed items vary: some have 10, others 100+
- **CRITICAL**: Check `if channel is None` not `if not channel` (latter causes DeprecationWarning)
- **CRITICAL**: Check individual elements with `if elem is None` not `if not elem`

## RSS Feed Platform Issues
- **CBC feeds (cbc.ca)**: All fail consistently - geolocation or rate-limiting issue
- **Acast feeds (acast.com)**: ✅ FIXED - Require `User-Agent: Mozilla/5.0...` header to avoid 403
- **Buzzsprout feeds**: ✅ FIXED - Require `User-Agent: Mozilla/5.0...` header to avoid 403
- **Anchor feeds (anchor.fm)**: Some fail with XML parse errors
- **Spreaker feeds**: Work but may have unusual structure
- Success rate: ~90%+ with proper User-Agent headers, 100% for major US platforms (Megaphone, Simplecast, Art19, Libsyn, Omnycontent)

## Audio URL Validation
- Use HEAD requests to verify 200/301/302/206 status
- Many URLs use redirect chains (podtrac, tracking services)
- Timeout: 10 seconds is reasonable
- **Content-Type check is CRITICAL**: Must be `audio/*`, `video/*`, or `application/octet-stream`
- If returns `text/html`, the URL is a web page, not audio - REJECT it
- **CDN Anti-Bot Protection**: Acast (sphinx.acast.com) and Buzzsprout CDNs block HEAD requests or return wrong Content-Type
- **Solution**: Whitelist trusted CDNs (sphinx.acast.com, www.buzzsprout.com, feeds.acast.com, rss.buzzsprout.com) and skip validation for known legitimate sources
- Success rate with HEAD validation: ~95-100% for well-formed feeds (100% with CDN whitelist)

## Published Date Parsing
- RSS format: `Wed, 15 Nov 2023 12:00:00 +0000` (RFC 2822)
- Output format: `2023-11-15T12:00:00Z` (ISO 8601)
- Must handle multiple timezone formats:
  - `+0000` or `-0800` (numeric offset)
  - `GMT`, `UTC`, `EST`, etc. (timezone codes)
  - No timezone (assume UTC)
- **Acast feeds use `GMT`** not `+0000` - require multi-pattern parser
- **CRITICAL**: Never return empty string `""` - if parse fails, skip the episode entirely
- Empty published_at will break JSON decoder in app

## Duration Conversion
```python
def parse_duration(duration_str):
    parts = duration_str.split(':')
    if len(parts) == 3:  # HH:MM:SS
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
    elif len(parts) == 2:  # MM:SS
        return int(parts[0]) * 60 + int(parts[1])
    else:  # seconds
        return int(float(duration_str))
```
- **Minimum duration**: 120 seconds - anything shorter is a promo/trailer/ad, not a real episode

## Supabase Integration
- Project URL: `https://juluhozqjothlomtwqlg.supabase.co`
- Use REST API: `POST /rest/v1/shared_favorites`
- Headers required:
  - `apikey: SERVICE_KEY` (from `.env`)
  - `Authorization: Bearer SERVICE_KEY`
  - `Content-Type: application/json`
  - `Prefer: return=representation` (returns inserted row)
- `favorites` field must be JSON STRING (use `json.dumps()`)
- `user_id` for shared lists: `f9f7c65e-fe45-4bb3-8518-5d88e0e8393a`
- Set `approved: true` to make visible immediately
- **BEFORE inserting**: Check for existing rows with same `list_name` and `user_id`, delete if found
- Response is array with single object containing `id` field

## Common Podcast Feed Issues
- **Hardcore History**: Very limited RSS feed (only recent episodes)
- **This American Life**: Episodes may not include specific titles in feed
- **Ear Hustle, Revisionist History**: Specific episodes not in recent feed
- Some podcasts only keep last 10-20 episodes in feed
- Paywalled content won't be in public RSS

## Best Practices
- **NO LIMITS**: Process ALL podcast mentions, not just top N
- Validate audio URLs before inserting (prevents broken links)
- Use iTunes artwork (artworkUrl600) for best quality (600x600)
- Match specific episodes when mentioned, else use first valid episode (>120s duration)
- Creative bio: capture thread theme in 1-3 sentences
- List name: 2-5 words, catchy and descriptive
- **Deduplication**: Check GUID and audio_url to remove duplicates
- **Single insert only**: Check for existing rows, delete before inserting new
- **Manual curation is best** for quality control - automated extraction misses context

## Podchaser Scraping
- **Podchaser blocks direct scraping**: Uses Cloudflare challenge page requiring JavaScript execution
- **Solution**: Internet Archive has cached versions of Podchaser lists
- Archive API: `https://web.archive.org/cdx/search/cdx?url=URL&output=json&limit=N`
- Fetch archived pages: `https://web.archive.org/web/TIMESTAMP/ORIGINAL_URL`
- Podchaser lists have episode URLs in format `/episodes/SLUG-ID`
- Can extract episode slugs from archived HTML using regex: `/episodes/([a-z0-9-]+)`
- Many famous episodes recognizable from slugs (e.g., "colors-9026215" = Radiolab Colors)
- **Key insight**: Manual episode mapping + iTunes/RSS validation more reliable than trying to scrape dynamic Podchaser pages

## Non-Reddit Sources
**Substack Newsletters** are excellent sources:
- Well-formatted content with direct pod.link URLs + iTunes IDs
- Curated by experts, high signal-to-noise ratio
- No need for fuzzy podcast name extraction like Reddit threads
- 100% validation rate possible (vs. 40-80% for Reddit threads)
- Example: Podcast The Newsletter - 12/12 episodes validated (100%)

**Forum Threads** (ResetEra, MetaFilter, etc.):
- Similar to Reddit but use WebFetch instead of JSON API
- Extract to clean plaintext first (strip HTML completely)
- Parse comment by comment to identify recommendations
- Same podcast mention patterns as Reddit threads
- Success rates: 80-90% with 2-phase processing (automated + manual)
- Example: ResetEra Best Episodes - 26/29 validated (89.7%)

## Successful Executions
1. **SPI thread** (200+ comments): 79 podcasts, 25 validated, Record: 98138df9-5ac9-4400-87f6-d881659a1ab0
2. **Unforgettable Episodes v1** (200 comments): 131 podcasts, 125 validated, Record: 4d7eef1a-94dd-4012-afb6-f981a1be3908
3. **Unforgettable Episodes v2** (200 comments): 127 mentions, 93 validated (73%), Record: 04b0a7a4-8fea-4304-b9b4-c712d2ffaa0a
   - Thread: https://www.reddit.com/r/podcasts/comments/1qy7guf/
   - 100% audio validation success (93/93)
   - 100% iTunes feed lookup success (65/65)
   - Top podcasts: Radiolab (14 episodes), Swindled (7), Criminal (5)
4. **Best of 2025** (191 comments): 87 unique mentions, 34 validated (39%), Record: e6c441d3-7ff3-412e-9187-51c891f95fc1
   - Thread: https://www.reddit.com/r/podcasts/comments/1ppwen6/
   - Used 2-phase approach: automated extraction + manual targeted lookups
   - Top podcasts: Heavyweight (5 episodes), Reply All (2), rest single episodes
   - Manual additions found 11 episodes that automated extraction missed
5. **Craziest True Crime Ever** (194 comments): 79 unique mentions, 62 validated (78.5%), Record: 51de1b96-3b6d-4fac-855f-b09a017bd6a2
   - Thread: https://www.reddit.com/r/podcasts/comments/1qpq807/
   - 100% audio validation success (62/62)
   - 100% iTunes feed lookup success (79/79)
   - 79.7% RSS parse success (63/79) - CBC/Acast feeds failed
   - Manual curation approach - high quality, low false positives
6. **Life-Changing Episodes** (184 comments): 101 mentions, 38 validated (37.6%), Record: 77602153-4785-4124-81bc-c88e29eb4437
   - Thread: https://www.reddit.com/r/podcasts/comments/eiqxta/
   - 2-phase processing: iTunes API (33 episodes) + manual feed URLs (5 episodes)
   - 100% validation pass rate - zero empty dates, zero broken audio URLs
   - Top podcasts: Reply All (7), Radiolab (6), This American Life (4), Hidden Brain (3)
   - **Key challenge**: Many classic episodes (TAL, Mystery Show) not in current RSS feeds or behind paywalls
   - **Feed blocking issues**: Megaphone (18 feeds), Simplecast (8 feeds), Art19 (2 feeds) returned 403/blocked
   - **Manual feed strategy successful**: Direct RSS URLs bypassed some iTunes failures
   - Username: "EpiphanyHunter" - Bio: "Curated from a Reddit thread about episodes that changed perspectives"
7. **Podchaser Best Episodes** (22 slugs extracted): 21 episodes found, 18 validated (85.7%), Record: abed0fe7-056c-446b-a2ee-3b929cc01c28
   - Source: https://www.podchaser.com/lists/best-podcast-episodes-of-all-time-107aDpOfPk (via Internet Archive)
   - Used archived HTML from April 2021 to extract episode slugs
   - Manual episode mapping based on slug recognition + iTunes validation
   - Filtered out 1 trailer episode (S-Town, 142s)
   - 100% audio validation success (18/18)
   - 95% iTunes feed lookup success (20/21) - StartUp podcast not found
   - Top podcasts: Radiolab (6 episodes), Reply All (3), Serial, 99% Invisible, Dirty John, Darknet Diaries, etc.
   - Username: "PodTimeCapsule" - Bio: "A curated collection of iconic podcast episodes that defined the medium"
8. **Substack Newsletter** (12 episodes): 12 validated (100%), Record: 50900561-7407-4887-9959-a9361b2b05cf
   - Source: https://podcastthenewsletter.substack.com/p/many-of-some-of-the-best-podcast-eb8
   - Newsletter format with direct pod.link URLs and iTunes IDs - much easier than Reddit threads
   - 100% iTunes feed lookup success (12/12)
   - 100% RSS parse success (12/12) - User-Agent headers fixed Acast/Buzzsprout issues
   - 100% audio validation success (12/12) - CDN whitelist for Acast/Buzzsprout
   - 100% episode match rate - specific episodes all found in current RSS feeds
   - Top feeds: Acast (3), Buzzsprout (3), Megaphone (2), Omny (2), Art19 (1), Captivate (1)
   - Username: "PodcastNewsletterBot" - Bio: Newsletter-curated exceptional episodes across comedy, documentary, culture
   - **Key lesson**: Curated newsletter sources > crowdsourced Reddit threads for validation success
9. **ResetEra Best Episodes** (29 mentions): 26 validated (89.7%), Record: 57dd3b8e-fa28-45b2-b823-0b2ebce72de4
   - Source: https://www.resetera.com/threads/what-is-the-best-individual-podcast-episode-ever-made.723906/
   - Forum thread from May 2023, processed via WebFetch (forum HTML → plaintext extraction)
   - 2-phase approach: automated (24 episodes) + manual iTunes searches (2 additional)
   - 100% audio validation success (26/26)
   - 89.7% iTunes feed lookup success (26/29) - 3 failed (GameTrailers, 1 audio 404)
   - Top podcasts: The Dollop (3), Last Podcast on the Left (3), Reply All (2), Doughboys (2), MBMBaM (2)
   - **Key insight**: Forums work similarly to Reddit - extract to plaintext first, parse comment by comment
   - Username: "ForumClassic" - Bio: "The ultimate podcast episodes handpicked by the ResetEra community"

## Episode Matching Challenges
- **Episode matching is hard**: People mention episodes in many ways - by title, number, description, host name
- Simple substring matching often fails for specific episodes when RSS feed doesn't have exact query match
- **Best strategy**: Use regex to strip punctuation, check episode numbers, score-based matching
- **Common failures**: Episodes mentioned by description only ("the one about X"), very old episodes not in current RSS
- **Manual review is essential** for high-quality threads - automated extraction misses ~30-40% of valid mentions

## Specific Episode Matching Challenges
- **Older episodes often not in current RSS feed** (e.g., Casefile back catalog)
- Podcasts typically only keep 10-100 most recent episodes in feed
- **Solution options**:
  1. Use Podcast Index API for historical episode lookup (has deeper archives)
  2. Use web search: `"Podcast Name" "Episode Title" site:podcasts.apple.com`
  3. Accept first valid episode from feed as fallback
- Some podcasts mentioned are discontinued (all episodes gone from feed)
- **Episode matching accuracy**: ~40-60% when specific episodes mentioned vs. found

## Quality Standards Evolution
- **Run 1-3**: Some empty published_at strings slipped through
- **Run 4**: Added manual review step, improved quality
- **Run 5**: 100% validation pass rate - zero empty dates, zero broken audio URLs
- **Key lesson**: Manual curation + strict validation = highest quality results

## Username Generation
Creative, believable usernames that feel human:
- Style 1: Hobby + Name (TrueCrimeTess, PodcastPete247, AudioNerd_Sarah)
- Style 2: Descriptive + Title (DeepDiveDana, MicCheckMike, CasefanCarrie, DeepMaven101)
- Style 3: Theme-based (TheEvidenceRoom, ColdCaseCarl, MysteryMaven_)
- Avoid: Generic patterns, obvious bot names, numbers-only suffixes

## BuzzFeed Article Scraping
- **HTML Structure**: Numbered paragraphs with pattern `<p>NUMBER. <a>Episode</a>, <i>Podcast</i>`
- **Multiple patterns**: Some entries have "and" for two episodes, some have podcast name as link
- **Article age matters**: 6-year-old article (2018) → 17% of episodes no longer in current RSS feeds
- **Common issues**: Older episodes dropped from feeds, podcasts rebranded (Still Processing → Cannonball), generic names match wrong podcasts (Nancy → Crime Stories with Nancy Grace)
- **Success rate**: 82.6% validation (19/23 episodes) is good for older articles
- **BuzzFeed URLs**: Use full HTML fetch + regex parsing, not WebFetch (which may miss embedded content)
9. **BuzzFeed Life-Changing Episodes** (23 episodes from 2018 article): 19 validated (82.6%), Record: b7214d89-3b2f-43fb-9fd3-d60ec4549d7b
   - Source: https://www.buzzfeed.com/rachelwmiller/best-podcast-episodes (Oct 2018)
   - Numbered list (1-22, with #2 having 2 episodes = 23 total)
   - 95.7% iTunes success (22/23) - only "Nancy" failed (matched wrong podcast)
   - 95.5% RSS parse success (21/22) - Still Processing only had 4 episodes
   - 82.6% validation (19/23) - 2 old episodes not in feeds, 1 broken audio URL, 1 wrong iTunes match
   - 100% audio validation (19/19 validated episodes)
   - Top podcasts: Radiolab (3), 99% Invisible (3), Revisionist History (3)
   - Username: "DeepMaven101" - Bio: "Curated from BuzzFeed's 2018 article..."
   - **Key insight**: Older articles (6+ years) have higher failure rate due to feed churn, but still 80%+ success is achievable

## Substack Article Scraping (NEW)
8. **Lauren Passell Best of 2025** (25 episodes from Substack): 20 validated (80%), Record: 69e1db7f-6535-4ec6-8bb1-6beb71877472
   - Source: https://podcastthenewsletter.substack.com/p/many-of-some-of-the-best-podcast (Parts 1 & 2)
   - Structured countdown list (Rank #25 to #1) with episode titles
   - 100% iTunes success (25/25 podcasts found)
   - 100% RSS parse success (25/25 feeds parsed)
   - 80% episode validation (20/25 passed final validation)
   - **Key failure mode**: Acast date parsing (4/5 failures) + Slate date parsing (1/5)
   - **Acast issue**: feeds.acast.com uses non-RFC 2822 pubDate format, Python datetime cannot parse
   - **Successful platforms**: Megaphone (5), Omny (4), Art19 (2), Simplecast (2), Buzzsprout (3), Soundcloud (1), PRX (1), WSJ (1), Captivate (1)
   - 100% audio validation (20/20 validated episodes)
   - 85% exact episode match rate (17/20), 10% keyword match (2/20), 5% fallback (1/20)
   - Username: "PodcastLauren2025" - Bio: "Hand-picked gems from Lauren Passell's 2025 countdown..."
   - **Key insight**: Substack/blog articles with explicit episode lists are MUCH easier to scrape than Reddit threads (no comment parsing, no mention extraction, explicit titles)

## Acast Date Parsing Issue (CRITICAL BLOCKER)
- **Problem**: Acast RSS feeds (feeds.acast.com) use non-standard pubDate format
- **Symptom**: Feeds fetch successfully, XML parses correctly, but all episodes fail validation due to unparseable dates
- **Impact**: 100% failure rate for Acast-hosted podcasts (4/4 in Substack run)
- **Root cause**: Acast's pubDate doesn't match RFC 2822 standard (`Wed, 15 Nov 2023 12:00:00 +0000`)
- **TODO**: Inspect actual Acast pubDate format and add custom parsing logic
- **Known Acast podcasts**: The Dream, Drifting Off with Joe Pera, The Blindboy Podcast, Pilot Season
- **Workaround**: None currently - must add Acast-specific date parser to fix
