# Radio Station Curator Agent Memory

## Supabase Configuration
- URL: `https://juluhozqjothlomtwqlg.supabase.co`
- Table: `curated_articles` (shared with podcast curator)
- Key env var: `SUPABASE_SERVICE_KEY` (in `.env`); URL is NOT in `.env` -- found in Python scripts
- Schema: `id` (uuid), `title`, `description`, `podcasts` (jsonb array), `is_published` (bool), `sort_order` (int, optional), `created_at`, `updated_at`, `content_type`
- Radio entries use `content_type: 'radio'`; podcast entries use `content_type: 'podcast'`
- Station object fields (inside `podcasts` jsonb array): `title`, `stream_url`, `website_url`, `description`, `genre`, `bitrate`, `location`, `is_24_7`, `source`
- Endpoint: `POST /rest/v1/curated_articles` with `Prefer: return=representation`

## Stream URL Validation
- Validate with `curl -sI --max-time 10 <URL>` -- look for `Content-Type: audio/mpeg` or `icy-name` headers
- 181.FM pattern: `http://listen.181fm.com/181-<channel>_128k.mp3` (e.g., `181-oldschool_128k.mp3`); old relay format `http://relay.181.fm:<PORT>` also works
- SomaFM pattern: `https://ice4.somafm.com/<channel>-128-mp3` (reliable, Icecast)
- NTS Infinite Mixtapes: `https://stream-mixtape-geo.ntslive.net/mixtape<N>` (mixtape2 = Low Key/100% Hip-Hop)
- laut.fm pattern: `https://stream.laut.fm/<station-name>` (302 redirects to working stream)
- WEFUNK: `https://www.wefunkradio.com/play/radio.mp3` redirects to `https://s-17.wefunkradio.com:8443/wefunk64.mp3` (64kbps)
- Skyrock: `https://icecast.skyrock.net/s/<channel>_aac_64k` (AAC, reliable)
- FluxFM: `http://streams.fluxfm.de/<channel>/mp3-320` (high quality, 302 redirect)
- Zeno.fm: `https://stream.zeno.fm/<id>` (302 redirect with JWT token)
- Hot 108 JAMZ: `http://sc.hot108.com:4000/` (Powerhitz network)
- Radio Caprice: `http://213.141.131.10:8002/<channel>` (e.g., oldschoolhiphop) -- AAC+ 48kbps
- Radionomy streams are DEAD -- all redirect to `streaming.brol.tech/rtfmlounge`
- Rhythm 98 (`cast6.my-control-panel.com`) was DOWN during validation (2026-02-13)

## Reliable Radio Directories
- See [directories.md](directories.md) for detailed notes
- fmstream.org: Comprehensive, has direct stream URLs in listings
- deroverda/recommended-radio-streams (GitHub): Hand-picked, well-organized, good quality
- OnlineRadioBox: Good metadata, but stream URLs hidden behind JS
- Streema: Good for discovery, stream URLs not always direct
- Radio Garden: Visual/geographic, useful for international stations
- rcast.net: Decent directory with 190+ hip-hop stations

## Completed Radio Collections
- **80s Hip-Hop** (2026-02-13): ID `807f16e6-330b-4abb-9344-eb6257e8d2f5`, 10 stations
- **Japanese Ambient / Kankyō Ongaku** (2026-02-13): ID `9a554840-43a9-45e2-870e-8fdb2f52c4c2`, 12 stations
- **Japanese City Pop** (2026-02-13): ID `2badafaa-5ac0-4d1a-9322-f96f845f960f`, 12 stations
- **Drum & Bass** (2026-02-13): ID `d44cceaf-dd85-4551-9fd3-e8068372132a`, 16 stations

## Research Tips
- Reddit site: operator searches often return no results via web search; use broader queries
- efe.kim/files/misc/stations has a comprehensive list of stream URLs for many networks (181.FM, SomaFM, etc.)
- NTS Radio Infinite Mixtapes are music-only themed streams (no talk); stream URLs from tiktuk/nts-radio-cli GitHub repo
- KISS FM Berlin has old school hip-hop channel but stream URLs require specific referrer headers
- AccuRadio and Big Noise Radio are web-player-only (no direct audio stream)
- GtronicRadio covers 1982-2012 specifically but NOT on Radio Browser API (no entry found)
- Radio Browser API: `de1.api.radio-browser.info/json/stations/search?tag=<tag>&order=votes&reverse=true` is the best way to find popular stations
- Radio Browser favicon field is the primary artwork source for the app
- FluxFM BoomFM Classics stream URLs contain session tokens but `http://streams.fluxfm.de/boomfm/mp3-320` works as a clean redirect
- Deejay One Two One Two (Italy) uses HLS (.m3u8) -- verify the app supports this format
- The Kyoto Connection Radio is the ONLY dedicated Japanese ambient internet radio station found; stream at `http://server.laradio.online:9009/stream` (Icecast, 128k MP3)
- Radio Art (radioart.com) Icecast servers return 400 to HEAD requests but work fine with GET -- connect takes ~1-2 seconds; domains: `air-tunein.radioart.com`, `air.radioart.com`, `live.radioart.com`, `air.radioart.online`
- MyNoise streams redirect: `http://zengarden.radio.mynoise.net/` -> `http://zengarden-mynoise.radioca.st/stream` (also returns 400 to HEAD, works with GET)
- ambient.fm redirects: `https://ambient.fm/live/` -> `https://phoebe.streamerr.co:4140/ambient.mp3` (Shoutcast, tagline "Made by Humans, no AI")
- Costa del Mar Zen: `http://stream.cdm-zen.com:8004/stream-mp3-Zen` (96k MP3, Icecast, "100% Zen Music from IBIZA")
- OTTAVA (Japanese classical radio) was UNREACHABLE during validation (2026-02-13) -- `http://ottava2.out.airtime.pro:8000/ottava2_a` timed out
- NTS Slow Focus (Infinite Mixtape 1): `https://stream-mixtape-geo.ntslive.net/mixtape` -- ambient/drone focused
- Radio Browser API: combined tag search `tag=japanese,ambient` returns 0 results; search tags individually
- Radio Browser API: `tagList=nature,ambient` works for AND-matching multiple tags
- St. Giga (legendary Japanese ambient radio, est. 1990) is defunct; archives on archive.org/details/stgigaarchive
- Asia Dream Radio network runs from torontocast.com; Jazz Sakura = `kathy.torontocast.com:3330`
- Asia Dream Radio full station list: Japan Hits (quincy:2020), J-Pop Powerplay (kathy:3560), Kawaii (kathy:3060), J-Pop Sakura Natsukashii (quincy:2070), J-Rock (kathy:3340), J-Club Hip Hop (kathy:3350), Jazz Sakura (kathy:3330). All use `/stream` suffix for HTTPS.
- TorontoCast stream pattern: `https://<host>.torontocast.com:<port>/stream` (HTTPS) or `http://<host>.torontocast.com:<port>/` (HTTP Shoutcast)
- BOX Radio / StreamAfrica pattern: `https://play.streamafrica.net/<channel>` redirects to `https://boxradio-edge-00.streamafrica.net/<slug>` (Icecast)
- Nightwave Plaza streams: `https://radio.plaza.one/mp3` (128k), `/mp3_low` (96k), `/ogg` (96k Opus), `/ogg_low` (64k Opus). HEAD returns 405 but GET works.
- Yumi Co. Radio: `https://yumicoradio.net/stream` (256kbps MP3, France, future funk + city pop)
- J1 Radio network: J1 Hits (`jenny.torontocast.com:2000/stream/J1HITS`), J1 Gold (`/stream/J1GOLD`). Broadcasting since 2009.
- City Pop family streams: `http://65.21.61.215:8000/citypop{one,two,three}` (Icecast, European server). One=Japanese, Two=Korean, Three=70s, Four=Chinese.
- JPHiP Radio (`radio.jphip.com:8800`) was UNREACHABLE during validation (2026-02-13)
- Zeno.fm streams reject HEAD requests (405) but work fine with GET
- radomd92/8b9663470b03f34e2ecc4f287a23fc1c GitHub Gist has a Japanese radio station XML with stream URLs (some outdated)
- citypopradio.es (City Pop Radio Valencia, Spain) -- website blocked, could not extract direct stream URL

## College & Independent Radio Stations
- **Major curated collection** (2026-02-16): ID `e9876ea5-2806-4e92-99d8-543a98a36d47`, 40 stations
- College radio stations (KEXP, WTJU, KDVS, WXDU, WRSU, WPRB, KALX, KXLU, WXPN, WXYC, WZBC, WREK, WMBR, WMFO, WRCT, KVRX, WERS, WRAS, CJSR, KFJC)
- Community/listener-supported (CKUA, WPKN, WMOT, KRVM, WYCE, KOOP, KUTX, WTMD, WORT, WEFT, CHIRP, KXCI, WEQX, WNCW, WWOZ, KCRW)
- Internet-only & international (SomaFM, NTS Radio, XRAY.fm)
- **Key finding**: College radio streams via Radio Browser API very reliable; many have direct StreamGuys/BroadcastTool URLs
- **Stream validation**: 40 stations validated with HTTP 200 + audio content-type
- **Artwork**: 62.5% had Radio Browser `favicon` URLs available; excluded rest rather than guess
- **Source**: MetaFilter Ask thread #381338 "Video killed the radio star - but not the good stations!"

## Drum & Bass Stations
- DNBRadio ecosystem: Multiple channels available (`dnbradio_main.mp3`, `dnbradio_darkstep.mp3` via multiple mirrors) -- 320kbps MP3, highly available
- DNBRadio primary: `http://ildnb1.dnbradio.com:8000/dnbradio_main.mp3` (Germany mirror, 320k) with fallback `http://trace.dnbradio.com:8000/dnbradio_main.mp3`
- DNBRadio Darkstep: `http://trace.dnbradio.com:8000/dnbradio_darkstep.mp3` (128k AAC+, dark technical DNB)
- Bassdrive: `http://ice.bassdrive.net/stream` (128k MP3, 1990s independent radio, liquid funk focus). Also available: 32k, 56k AAC+ variants for low bandwidth
- JungleTrain.net: `https://chat.jungletrain.net/streamtest/;stream/1` (256k MP3, Netherlands, since 2002, jungle-focused)
- Different Drumz: `http://andromeda.shoutca.st:8031/` (192k MP3, UK, community label, liquid DNB)
- Sub.fm: `http://subfm.radioca.st/Sub.FM` (192k MP3, UK, dubstep/garage/bass music sister genre)
- Record Neurofunk: `https://radiorecord.hostingradio.ru/neurofunk96.aacp` (96k AAC, Russia, dark technical DNB)
- Radio Record Liquid Funk: `https://radiorecord.hostingradio.ru/liquidfunk96.aacp` (96k AAC, Russia, melodic DNB)
- Rinse FM Channels: Legendary London pirate radio with DNB shows; SWU FM (`https://admin.stream.rinse.fm/proxy/swu/stream`, 128k MP3) is dedicated DNB channel
- RadioGoose DnB: `https://stream3.radiogoose.ru/listen/dnb/play` (320k MP3, Russia, high bitrate)
- Strictly Ragga Jungle: `https://ssl.aloncast.com:1670/` (320k MP3, ragga/roots reggae side of jungle)
- Radio Browser API: `tag=dnb` search works well for finding all DNB streams (order by votes recommended)
- Xiph Directory: Also has 6+ dedicated DNB streams with stream URLs visible in Icecast directory listing
- Artwork coverage for DNB: 75% have favicon URLs from Radio Browser; 4 stations missing (DnB Liquified, Dutch Delite, plain Liquid DnB, DnB&EDM)