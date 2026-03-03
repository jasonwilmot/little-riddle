# PodcastIndex API Tips

## Authentication
- Headers: `X-Auth-Key`, `X-Auth-Date` (epoch seconds), `Authorization` (SHA-1 of key+secret+date)
- User-Agent: `StumbleCast-Curator/1.0`

## Search Tips
- `search/byterm?q=QUERY` is the primary search endpoint
- Accented characters (e.g., "Siecle" with accent) cause search failures; use `podcasts/byitunesid?id=ID` as fallback
- Compound names may need to be searched without spaces (e.g., "HistoryExtra" not "History Extra")
- Search by author name can help when podcast title is generic
- Always try the first result — PodcastIndex ranking is generally accurate

## iTunes ID Lookup
- `podcasts/byitunesid?id=ITUNES_ID` — reliable fallback when search fails
- iTunes IDs can be extracted from Apple Podcasts URLs: `podcasts.apple.com/.../id{ITUNES_ID}`
- Returns a single `feed` object, not an array of `feeds`
- IMPORTANT: Some iTunes IDs (e.g., 1291332174 for Cults/Parcast) return empty feed objects. The `feed` field can sometimes be a list instead of a dict — always handle both cases
- For Spotify-exclusive shows (Parcast/Spotify Studios), search by title with `search/byterm` works better than iTunes ID lookup

## Search Gotchas
- "Cults" by Parcast: search "Cults Spotify" to find it (generic "Cults" returns many unrelated results)
- "Mile Higher" needs exact name search (not "Mile Higher Podcast")
- "Truer Crime Podcast" not found on PodcastIndex — may be too small/new
- Podchaser (podchaser.com) returns 403 to web fetch — cannot scrape curated lists directly
- "The Bunt" (skateboarding): generic name returns unrelated results; search "The Bunt" without qualifiers returns the correct first result, but adding "skateboarding" returns nothing
- "Grosso's Loveletters to Skateboarding" — not on PodcastIndex (it's a YouTube/Vans video series, not a traditional podcast)
- "Weekend Buzz", "CBI", "A Happy Medium" — not found on PodcastIndex; may be video-only or defunct
- Some SoundCloud-hosted podcasts have duplicate entries (one with iTunes ID, one without); prefer the one with iTunes ID
- Looking Sideways has moved to Substack; the Substack feed (`api.substack.com/feed/podcast/{ID}.rss`) has the iTunes ID, the old FeedBurner one does not
- "Synth Zone" not found by term search (even as one word "SynthZone"); must use iTunes ID lookup (1138193112). Feed is on Spreaker and marked dead since 2022
- "Forever Synth" found on PodcastIndex but has 0 episodes (SoundCloud feed empty) — exclude these

## Feed URL Patterns
- Megaphone: `https://feeds.megaphone.fm/{ID}`
- Libsyn: `https://{show}.libsyn.com/rss`
- Anchor/Spotify: `https://anchor.fm/s/{ID}/podcast/rss`
- FeedBurner: `http://feeds.feedburner.com/{name}` (legacy but still active)
- BBC: `https://podcasts.files.bbci.co.uk/{ID}.rss`
- Simplecast: `https://feeds.simplecast.com/{ID}`
- Spreaker: `https://www.spreaker.com/show/{ID}/episodes/feed`
- Castos: `https://{domain}/feed/podcast/` (self-hosted WordPress plugin)
- Acast: `https://feeds.acast.com/public/shows/{ID}`
- Nightride FM: `https://news.nightride.fm/podcast/{show}/rss/`

## Podcast-Specific Gotchas
- "Eye On A.I." by Craig Smith: has periods in the name ("A.I."), search by term fails for "Eye on AI" — must use iTunes ID lookup (1438378439)
- "No Priors" by Elad Gil/Sarah Guo: search by term returns a different "No Priors AI" podcast (Art19 duplicate/different show). Must use iTunes ID 1668002688 to find the correct Conviction/Megaphone feed
- "High Agency" by Humanloop/Raza Habib: found via iTunes ID 1747605459, but feed returns HTTP 404 — podcast may have moved or gone defunct. Transistor feed URL broken as of Feb 2026
- "AI in Business" by Daniel Faggella/Emerj: search "AI in Business" returns dozens of generic results. Use iTunes ID 670771965 for the correct Emerj podcast (techemergence.libsyn.com/rss)
- "AI For Humans" by Kevin Pereira & Gavin Purcell: searching "Practical AI" returns this as the first result (not Practical AI by Changelog). Add "Changelog" to the search to find Practical AI

## Supabase curl Issues
- Shell `source .env` can break curl due to special characters in env vars. Use Python urllib instead to avoid escaping problems
- Write JSON payload to a file and use Python to POST — more reliable than curl for complex JSON with special characters

## Rate Limiting
- Add 0.3s delay between requests to be safe
- No explicit rate limit documented, but courtesy delays prevent issues
