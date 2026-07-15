import yt_dlp

def download_yt_video(url):
    ydl_opts = {
        'format' : 'best[height<=1080]/best',
        'noplaylist' : True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])
        
if __name__== "__main__":
    import sys, os
    video_url = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("YT_URL", "")
    if not video_url:
        video_url = input("Enter the youtube video URL: ")
    download_yt_video(video_url)