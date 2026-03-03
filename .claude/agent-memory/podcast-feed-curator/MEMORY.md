# Podcast Feed Curator Memory

## Catalog Location
- Path: `/Users/jasonwilmot/Documents/GitHub/podcast/PodRadio/Resources/catalog.json`
- Structure: `{ "version": N, "feeds": [...] }` where each feed has `name`, `rssURL`, `category`
- Version increments with each update
- Current: version 38, 584 feeds total, 15 in TV & Film

## Feed Hosting Patterns
### Common Hosts
- **Simplecast**: `https://feeds.simplecast.com/[ID]` (Radiolab, 99% Invisible, How Did This Get Made)
- **Megaphone**: `https://feeds.megaphone.fm/[ID]` (Rewatchables, Blank Check, Filmspotting, The Watch, Big Picture, Unspooled, Next Picture Show, Bald and the Beautiful)
- **NPR**: `https://feeds.npr.org/[PODCAST_ID]/podcast.xml` (TED Radio Hour, Hidden Brain, Pop Culture Happy Hour)
- **Omny**: `https://omnycontent.com/d/playlist/[...]/podcast.rss` (Stuff You Should Know, Films To Be Buried With, Las Culturistas)
- **BBC**: `https://podcasts.files.bbci.co.uk/[ID].rss` (In Our Time)
- **Feedburner**: `https://feeds.feedburner.com/[name]` (Hardcore History, The Moth)
- **Buzzsprout**: `https://rss.buzzsprout.com/[ID].rss` (You're Wrong About)
- **Audioboom**: `https://audioboom.com/channels/[ID].rss` (No Such Thing as a Fish, We Hate Movies)
- **ART19**: `https://rss.art19.com/[podcast-name]` (How I Built This)
- **Libsyn**: `https://[podcast].libsyn.com/rss` or `https://rss.libsyn.com/shows/[ID]/destinations/[ID].xml` (Scriptnotes, Screen Drafts)
- **Acast**: `https://feeds.acast.com/public/shows/[podcast]` (Decoding TV)

## Categories in Catalog
All categories: Music, Technology, Comedy, Education, News, True Crime, History, Self Improvement, Science, Ambient, Blues, Business, Classical, Country, Eclectic, Fiction, Health, Hip-Hop, Holiday, Interview, Jazz, Lounge, Pop, Rock, Scanner, Sleep, Society, Soul & Funk, Sounds, Sports, World, TV & Film

## Podcast Research Sources
### Highly Valuable
- Reddit: r/podcasts threads, r/TrueFilm for film podcasts
- Webby Awards (category-specific winners/nominees)
- NPR curated lists
- Publication "best of" lists (Vulture, Time, The Atlantic, Podcast Review, FeedSpot)
- The Ringer network (Rewatchables, Watch, Big Picture - all Megaphone hosted)
- iHeartRadio/Big Money Players network (Las Culturistas, Films To Be Buried With)

### Award Winners/Nominees Found
- Webby Education: Michelle Obama: The Light Podcast, Can't Afford Therapy Podcast
- Webby 2025 Nominees (TV & Film): Baby This is Keke Palmer, Las Culturistas, The Bald and the Beautiful

## Duplicate Tracking
Podcasts in catalog under different categories than expected:
- **How Did This Get Made?**: Comedy (not TV & Film) - RSS: https://feeds.simplecast.com/Ao0C24M8
- **You Must Remember This**: History (not TV & Film) - RSS: https://feeds.megaphone.fm/YMRT7068253588
- **Radiolab**: News (not Education)
- **99% Invisible**: Technology (not Education)
- **Revisionist History**: True Crime (not Education)
- **Life Kit**: Self Improvement (not Education)

Cross-check ENTIRE catalog by name AND RSS URL before adding.

## Discontinued/Paused Podcasts
- **The Anthropocene Reviewed** (John Green): On hiatus since Sept 2020, converted to book
- **Binge Mode** (The Ringer): Ended Feb 2021, transitioned to The Ringer-Verse

## Feed Validation Notes
- Always test feeds with curl to verify XML structure
- Check for `<enclosure>` tags with audio URLs
- Verify recent `<pubDate>` (within last year for active shows)
- WebFetch may fail on very large feeds (Harvard EdCast ~10MB+)
- Use curl + grep for initial validation on large feeds

## Quality Bar for "Acclaimed"
- Must appear in MULTIPLE sources (Reddit + awards, or Reddit + publication lists, or awards + critic reviews)
- Single-source mentions are insufficient
- Community recommendations with high upvotes count as strong signals
- Award nominations/wins are strong signals

## Workflow Improvements
- Always backup catalog.json before modifications
- Use jq for JSON manipulation to ensure valid output
- Check existing entries by both name and RSS URL
- Increment version number with each update
