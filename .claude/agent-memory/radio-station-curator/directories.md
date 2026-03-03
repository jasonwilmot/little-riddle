# Radio Directory Notes

## Tier 1 (Best for finding stream URLs)
- **fmstream.org**: Has direct stream URLs for many stations. Organized by country and genre. Checks FMLIST DB every ~3 months.
- **efe.kim/files/misc/stations**: Plain text file with hundreds of stream URLs, organized by network/genre. Excellent for 181.FM, Radionomy (now mostly dead), and other networks.
- **deroverda/recommended-radio-streams** (GitHub): Hand-picked directory with descriptions. Includes Big Noise Radio, NTS Low Key, Radio Caprice, God's House of Hip Hop.
- **SomaFM directstreamlinks.html**: Each channel has `/directstreamlinks.html` page with all format options (AAC, MP3, HE-AAC at various bitrates).
- **RadioTunes PLS files**: `http://listen.radiotunes.com/public3/<channel>.pls` reveals actual server URLs.

## Tier 2 (Good for discovery, stream URLs harder to get)
- **OnlineRadioBox**: Great metadata (playlist history, listener counts). Stream URLs loaded via JS, not in page source.
- **Streema**: Good for discovery and cross-referencing. Sometimes has stream info.
- **Radio Garden**: Visual/geographic approach. Good for international stations. URLs are Radio Garden links, not direct streams.
- **rcast.net**: Internet radio directory. Has 190+ hip-hop stations. Can search by genre.
- **fmcube.net**: Has quality selectors (Premium/Standard/Economy) but stream URLs behind JS.
- **myTuner Radio**: App-focused aggregator. Useful for discovering stations.

## Tier 3 (Supplementary)
- **Shoutcast directory** (directory.shoutcast.com): Large directory but many dead stations.
- **Xiph/Icecast directory** (dir.xiph.org): Open-source directory. Has hiphop genre.
- **Live365**: Platform for independent stations. Direct listen URLs follow pattern `player.live365.com/<stationId>`.
- **TuneIn**: Massive directory but direct stream URLs are heavily obfuscated.

## Dead/Unreliable
- **Radionomy** (streaming.radionomy.com): ALL streams now redirect to `streaming.brol.tech/rtfmlounge` (a lounge station). Do not use Radionomy URLs.
- **100hitz** (purestream.net): Appears down/unresponsive.
