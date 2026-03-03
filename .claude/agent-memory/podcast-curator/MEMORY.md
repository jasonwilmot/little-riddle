# Podcast Curator Agent Memory

## Supabase Configuration
- URL: `https://juluhozqjothlomtwqlg.supabase.co`
- Table: `curated_articles`
- Schema: `id` (uuid), `title` (text), `description` (text), `podcasts` (jsonb array), `is_published` (bool), `sort_order` (int, optional), `created_at`, `updated_at`
- Podcast object fields: `title`, `author`, `feed_url`, `itunes_id` (number), `artwork_url`
- Endpoint: `POST /rest/v1/curated_articles` with `Prefer: return=representation`
- Service key env var: `SUPABASE_SERVICE_KEY` (in `.env`), URL is NOT in `.env` — found in Python scripts

## PodcastIndex API Notes
- See [podcastindex-tips.md](podcastindex-tips.md) for detailed search tips
- Auth: SHA-1 of (key + secret + epoch_seconds)
- The Siecle podcast has accent characters; search by term fails. Use `podcasts/byitunesid` endpoint with iTunes ID 1450123576 as fallback
- "History Extra" must be searched as "HistoryExtra" (one word)
- FeedBurner URLs are still valid for some older podcasts (e.g., Napoleon Bonaparte Podcast, Dan Carlin)

## Community Research Patterns
- See [community-sources.md](community-sources.md) for source quality notes
- Reddit site: operator searches often return no results via web search; use broader queries instead
- Hacker News threads about specific historical topics often contain niche podcast recommendations (e.g., Literature and History was found via HN)
- Audible's "best listens about X" blog posts are useful secondary sources
- player.fm and feedspot.com aggregate podcast lists by topic — good for initial candidate discovery

## Completed Articles
- **Napoleon** (2026-02-13): ID `32627287-8a58-4dfe-80b2-7036e6d4ed2d`, 10 podcasts
- **Charles Manson** (2026-02-13): ID `e017c577-9011-4f8e-a44f-8f88613ecd5f`, 12 podcasts
- **Skateboarding** (2026-02-13): ID `032ada5e-5838-4d8b-9476-e434c30581a5`, 11 podcasts
- **Synthwave** (2026-02-13): ID `06357eda-06fc-4dca-9e7d-cb3069b91e63`, 10 podcasts
- **Artificial Intelligence** (2026-02-13): ID `960f21d4-64c2-4141-8c02-0d2d2d8c6150`, 13 podcasts
