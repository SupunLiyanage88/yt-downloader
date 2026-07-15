# Pulse

A clean, fast YouTube video downloader built with Next.js and yt-dlp.

## Features

- **Lightning Fast** — Powered by yt-dlp for rapid downloads
- **HD Quality** — Up to 1080p, best available format every time
- **Free & Unlimited** — No sign-ups, no limits, no paywalls
- **Dark & Light Theme** — Automatic system preference detection with manual toggle
- **Open Source** — Free to use and contribute

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Font:** Geist Sans + Geist Mono
- **Backend:** Python 3 + yt-dlp

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.x with `yt-dlp` installed

```bash
pip install -r requirements.txt
```

### Installation

```bash
git clone https://github.com/SupunLiyanage88/yt-downloader.git
cd yt-downloader/web
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Project Structure

```
yt-downloader/
├── yt_downloader.py       # Python download script (yt-dlp)
├── requirements.txt       # Python dependencies
└── web/                   # Next.js frontend
    └── src/
        └── app/
            ├── layout.tsx    # Root layout with Geist font
            ├── page.tsx      # Main application UI
            ├── globals.css   # Theme system and utilities
            └── api/
                └── download/
                    └── route.ts  # Download API endpoint
```

## How It Works

1. Paste a YouTube URL into the input field
2. The frontend sends a POST request to `/api/download`
3. The API route spawns a Python subprocess running `yt_downloader.py`
4. yt-dlp downloads the video to a temp directory
5. The file is streamed back to the browser for download

## License

MIT
