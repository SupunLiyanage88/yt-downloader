"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";

const GITHUB_REPO = "SupunLiyanage88/yt-downloader";

function ArrowDownIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

const features = [
  {
    icon: <BoltIcon />,
    title: "Lightning Fast",
    description: "Powered by yt-dlp for rapid downloads. No queues, no waiting.",
  },
  {
    icon: <ShieldIcon />,
    title: "HD Quality",
    description: "Up to 1080p. Best available format, every time.",
  },
  {
    icon: <GlobeIcon />,
    title: "Free & Unlimited",
    description: "No hidden limits, no paywalls, no account required.",
  },
];

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "downloading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("pulse-theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pulse-theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus("downloading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorMsg(err.error || "Download failed");
        setStatus("error");
        return;
      }

      const blob = await res.blob();
      const filename =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename\*=UTF-8''(.+)/)?.[1]
          ?.replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
          ?.replace(/["']/g, "") ?? "video.mp4";

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setStatus("done");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="relative min-h-dvh bg-theme">
      <div className="pointer-events-none fixed inset-0 bg-grid" />

      <header className="sticky top-0 z-50 border-b border-theme transition-theme">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:h-16">
          <a href="/" className="flex items-center gap-2.5">
            <span className="text-lg font-bold tracking-tight text-theme">pulse</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-theme bg-surface text-theme-muted transition-theme hover:border-theme-hover hover:text-theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg border border-theme bg-surface px-3 py-1.5 text-sm font-medium text-theme-secondary transition-theme hover:border-theme-hover hover:text-theme"
            >
              <StarIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative px-5 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-theme bg-surface px-3 py-1 text-xs font-medium text-theme-muted transition-theme">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Open source &middot; Free to use
              </div>

              <h1 className="text-4xl font-bold tracking-tighter text-theme sm:text-5xl lg:text-6xl">
                Download YouTube
                <br />
                <span className="text-accent">at the speed of pulse</span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-relaxed text-theme-secondary sm:text-lg">
                Paste any YouTube link. Get pristine HD quality.
                No sign-ups, no limits, no fuss.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 max-w-xl">
                <div className="relative flex items-center gap-2 rounded-xl border border-theme bg-surface p-1.5 transition-theme focus-within:border-accent focus-within:shadow-accent">
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (status === "error" || status === "done") setStatus("idle");
                    }}
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-theme placeholder:text-theme-muted focus:outline-none sm:text-base"
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === "downloading" || !url.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-theme hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent disabled:active:scale-100 shadow-accent"
                  >
                    {status === "downloading" ? (
                      <>
                        <SpinnerIcon /> Downloading
                      </>
                    ) : (
                      <>
                        <ArrowDownIcon /> Download
                      </>
                    )}
                  </button>
                </div>
              </form>

              {status === "downloading" && (
                <p className="mt-4 flex items-center gap-2 text-sm text-theme-secondary">
                  <SpinnerIcon />
                  Fetching your video...
                </p>
              )}

              {status === "done" && (
                <p className="mt-4 flex items-center gap-2 text-sm text-green-500">
                  <CheckIcon />
                  Download started. Check your browser downloads.
                </p>
              )}

              {status === "error" && (
                <p className="mt-4 flex items-center gap-2 text-sm text-red-500">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {errorMsg}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="relative px-5 pb-24 sm:pb-32">
          <div className="mx-auto max-w-5xl">
            <div className="mb-10">
              <h2 className="text-2xl font-bold tracking-tight text-theme sm:text-3xl">
                Why Pulse?
              </h2>
              <p className="mt-2 text-theme-secondary">
                Built for speed. Designed for simplicity.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-xl border border-theme bg-surface p-5 transition-theme hover:border-theme-hover hover:shadow-theme-md"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-subtle text-accent">
                    {f.icon}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-theme">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-theme-secondary">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-5 pb-24 sm:pb-32">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-theme bg-surface p-8 text-center transition-theme sm:p-10">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                <StarIcon className="h-5 w-5" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-theme sm:text-2xl">
                Support Pulse
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm text-theme-secondary">
                Pulse is open source and free. If you find it useful, drop a star
                on GitHub.
              </p>

              <a
                href={`https://github.com/${GITHUB_REPO}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-theme bg-surface px-5 py-2.5 text-sm font-semibold text-theme transition-theme hover:border-theme-hover hover:shadow-theme-md active:scale-[0.98]"
              >
                <StarIcon className="h-4 w-4" />
                Star on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-theme px-5 py-6 transition-theme">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-theme-muted">
            <span className="font-semibold text-theme-secondary">pulse</span>
            &mdash; Open source YouTube downloader
          </div>
          <div className="flex items-center gap-5 text-sm text-theme-muted">
            <a
              href={`https://github.com/${GITHUB_REPO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-theme hover:text-theme"
            >
              GitHub
            </a>
            <span>
              Next.js + yt-dlp
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
