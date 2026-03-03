# Podcast Favorites List Creator

You will create a favorites list in the supabse table shared_favorites using the user id created in your first step and the topic supplied using the supabase rest api and the service key store in the .env file

## Create a new user in supabase
-Using the supabase REST api and the service key in the .env file create a user with the email address com with the password 12345.  The email address should simply be the topic name, replacing the spaces with . and @stumblecast.com.  For example product.management@stumblecast.com.  You will remember this id and use it to save a record to shared_favorites.
-Using that ID, create a record in the supabase table called users and add the username as the topic supplied by the user, e.g. 'hip hop', 'product management', etc. Also use the phone field with +5555555555

## Research on the internet for particular episodes that people are recommending
You will search the web for a certain number of podcasts requested by the user, e.g. the 25 best and most referenced podcast episdoes on the internet with a strong focus on acclaimed and well respected websites.

### Sources to Investigate
- **Reddit**: Find various subreddits associated with the topic area
- **Specialized Websites in the topic area**: Blogs and domains specific websites
- **Podcast Charts & Rankings**: Apple Podcasts, Spotify, Podchaser, Chartable, Listen Notes
- **Review Aggregators**: Podcast review sites, Reddit communities (r/podcasts, genre-specific subreddits), podcast Twitter/X communities



## Find the rss links for the relevant podcasts:
-You will use the itunes web api to find the most likely rss feed for each episode.  An example command you will run will be Fetch(https://itunes.apple.com/search?term=aztec%20culture&media=podcast&limit=10) if the user wanted podcasts on 'aztec culture'.
- Do not use any other websearches.  The only website you will ever use will be itunes.apple.com

 


## Find the episode within the rss feed
- You will parse each txt file returned from itunes to extract the metadata for the episode and the podcast itself.
- Extract all the data for the podcast and particular episode
- If the podcast episode does not have an image, replace it with the image from the podcast itself.
- Verify at least one episode has a valid audio enclosure URL
- Confirm podcast title matches or relates to the provided title
- Check that audio URLs use HTTPS (flag HTTP as potential issue)
- Validate that GUIDs are unique across episodes
- Make sure you have an image from either the podcast episode itself and if not, from the podcast



### Add each podcast name and podcast episode as part of the json you will add to the favorites column in the supabase database record
- The format of the favorites column.  This is just an example:

"[{\"published_at\":\"2025-03-28T05:09:00Z\",\"guid\":\"a0d620b8-6ba8-4630-97f9-eb529387357a\",\"feed_url\":\"https:\\/\\/wayofchampions.libsyn.com\\/woc\",\"podcast_artwork_url\":\"https:\\/\\/static.libsyn.com\\/p\\/assets\\/5\\/7\\/7\\/3\\/5773c4198f6c0fd8d959afa2a1bf1c87\\/WOC_Cover_2_Apple.jpg\",\"title\":\"#422 Dr. Debbie Sayers, Co-Founder of the Campaign for Children's Rights in Football\",\"audio_url\":\"https:\\/\\/traffic.libsyn.com\\/secure\\/wayofchampions\\/Debbie_Sayers_final_.mp3?dest-id=495594\",\"podcast_title\":\"Way of Champions Podcast\",\"duration\":4248},{\"published_at\":\"2025-05-12T08:00:00Z\",\"guid\":\"http:\\/\\/audio.thisisdistorted.com\\/repository\\/audio\\/episodes\\/NORA_455_iTunes-1746696690579941720-NDA5NjQtODc0NDM1Mzg=.mp3\",\"feed_url\":\"http:\\/\\/portal-api.thisisdistorted.com\\/xml\\/nora-en-pure-purified-radio\",\"podcast_artwork_url\":\"https:\\/\\/distorted-dev.s3.amazonaws.com\\/Purified+iTunes.jpg\",\"artwork_url\":\"https:\\/\\/distorted-dev.s3.amazonaws.com\\/Purified+iTunes.jpg\",\"title\":\"Purified Radio 455\",\"audio_url\":\"https:\\/\\/audio.thisisdistorted.com\\/repository\\/audio\\/episodes\\/NORA_455_iTunes-1746696690579941720-NDA5NjQtODc0NDM1Mzg=.mp3\",\"podcast_title\":\"Nora En Pure - Purified Radio\",\"duration\":3644}]"


### Save the record to supabase
-You will use the Supabase rest api and the service account api key that is in the .env file
-You will use the user id you captured when creating the user at the beginning
- You will come up with creative and representative text for the bio field capturing the essence of the episodes you found.
- You will set the approved value to TRUE
- You will set the username to the username you added above
- You will save this record to supabase
