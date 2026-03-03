# Community Source Quality Notes

## By Source

### Reddit
- `site:reddit.com` searches via web search engines often return empty — use broader queries like "reddit [topic] podcast"
- Best subreddits for history topics: r/podcasts, r/history, r/AskHistorians
- Repeated mentions across multiple threads = strong social proof

### Hacker News
- `site:news.ycombinator.com` works well for web search
- History/intellectual topics get good podcast recommendations in comment threads
- Look for threads about books/topics adjacent to the podcast topic (e.g., "Books on Napoleon" thread had podcast recs)
- Thread ID 21391133 had good French Revolution/Napoleon podcast recs

### Metafilter
- FanFare section has podcast-specific discussions
- Ask MetaFilter has recommendation threads
- Generally lower volume of podcast recs than Reddit/HN for niche history topics

### Aggregator Sites
- player.fm/podcasts/{topic} — decent curated lists
- feedspot.com/{topic}_podcasts — top 10 lists, sometimes behind paywall content
- Audible blog posts ("best listens about X") — curated by editors, good quality
- millionpodcasts.com — large database but lower curation quality

### Apple Podcasts
- iTunes IDs can be extracted from URLs for PodcastIndex lookups
- Editorial collections exist but aren't easy to search programmatically

### Podchaser
- Has curated episode lists (e.g., "13 Podcasts About The Manson Family" by TrueCrimeAlltheTime)
- Returns 403 on web fetch — cannot scrape directly, but search results show list titles and URLs
- Useful for discovering podcast names mentioned in curated lists even if content can't be fetched

### Listen Notes
- listennotes.com/top-podcasts/{topic}/ — good for finding top episodes on specific topics
- Shows individual episodes ranked by topic, useful for validating which shows cover a subject

## By Topic Type
- **History (specific figure/era)**: HN + Reddit r/history yield the best niche recs
- **True Crime**: Reddit r/podcasts dominates; Podchaser curated lists are excellent secondary source; player.fm has good aggregated lists
- **Cults/True Crime crossover**: Search for both the crime angle AND the cult angle separately — yields different podcast recommendations
- **Comedy**: Reddit + Apple editorial picks
- **Science/Tech**: HN is the best source
- **Action Sports (skateboarding/surfing/snowboarding)**: Niche skate media sites (doseskateboarding.com, loveskatemag, stokedrideshop.com) are the best primary sources; goodpods.com category leaderboards work well; HN has minimal coverage of sports podcasts; Vans brand blog (vans.com/blog) has curated lists but returns 403 on fetch
- **Music genres (synthwave/niche electronic)**: feedspot.com synthwave_podcasts is the best aggregator (returns 403 on fetch but search snippets list all names); nightride.fm is the central hub for synthwave podcasts (The State of Synth, KZL Live); SoundCloud is a major podcast host for this scene (Beyond Synth, HeartBeatHero, Retro Party); Reddit r/outrun and r/synthwave have genre discussion but fewer podcast-specific threads than expected; player.fm/podcasts/Synthwave returns 403
- **AI/Machine Learning**: Extremely well-served category with 15+ dedicated podcasts. Best sources: HN "Ask HN: What AI podcasts" threads (item 38206223), arize.com/ai-podcasts/ (comprehensive curated list), humanloop.com/blog/best-ai-podcasts, hatchworks.com/blog/gen-ai/top-10-ai-podcasts/. KDnuggets and DigitalOcean also have good lists. feedspot.com ai_podcasts returns 403 but search snippets list names. Key HN thread 46411500 (Best Podcasts of 2025) had Latent Space and Dwarkesh recs

### Niche Media Sites
- doseskateboarding.com — curated skateboarding podcast articles (fetching can fail)
- stokedrideshop.com/blogs — "best skateboarding podcasts" lists but content often truncated on fetch
- loveskatemag (mtlmediagroup.com) — comprehensive 18-podcast list, good source for lesser-known shows like Talkin' Schmit, Ripride, Savage Radio
- goodpods.com/leaderboard/top-100-shows-by-category/sports/{topic} — returns 403 on fetch but search result summaries are useful
