import asyncio
from pytube import YouTube, Playlist
from moviepy import AudioFileClip
import os

async def download_and_convert(url, output_path='downloads'):
    try:
        # Download audio stream using pytube
        def sync_download():
            yt = YouTube(url)
            audio_stream = yt.streams.filter(only_audio=True).first()
            print(f"Downloading: {yt.title}")
            return audio_stream.download(output_path=output_path)

        downloaded_file = await asyncio.to_thread(sync_download)

        # Convert to MP3 using moviepy
        def sync_convert():
            base, _ = os.path.splitext(downloaded_file)
            mp3_file = base + '.mp3'
            print(f"Converting to MP3: {mp3_file}")
            clip = AudioFileClip(downloaded_file)
            clip.write_audiofile(mp3_file)
            clip.close()
            os.remove(downloaded_file)
            return mp3_file

        mp3_file = await asyncio.to_thread(sync_convert)
        print(f"Done: {mp3_file}")

    except Exception as e:
        print(f"Error processing {url}: {e}")

async def main():
    # Input: mix of video and playlist URLs
    urls = [
        "https://youtu.be/cccccjl1SDU?si=mfFYI9n0Lw0q7t_I",
        "https://youtube.com/playlist?list=RDDuVaLWf2114&playnext=1&si=OGXvW7DKVO-wUHqm",
        "https://youtu.be/CC2E9uhlrXc?si=VRM8f-vm3HBwnBIG"
    ]

    # Ensure output directory exists
    os.makedirs("downloads", exist_ok=True)

    video_urls = []

    for url in urls:
        try:
            if "playlist" in url:
                playlist = Playlist(url)
                print(f"Found playlist with {len(playlist.video_urls)} videos")
                video_urls.extend(playlist.video_urls)
            else:
                # Clean up shortened or parameter-heavy URLs
                if "youtu.be" in url:
                    url = url.split('?')[0]  # Remove ?si=...
                    url = url.replace("youtu.be/", "www.youtube.com/watch?v=")
                elif "watch?v=" in url:
                    url = url.split('&')[0]  # Remove any other params
                video_urls.append(url)
        except Exception as e:
            print(f"Failed to process URL list entry: {url} — {e}")

    # Process one video at a time
    for video_url in video_urls:
        await download_and_convert(video_url)

# Run the main async function
if __name__ == "__main__":
    asyncio.run(main())
