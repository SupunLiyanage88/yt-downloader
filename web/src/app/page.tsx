"use client";

import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "downloading" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus("downloading");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Download failed");
        setStatus("idle");
        return;
      }

      const blob = await res.blob();
      const filename =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] ?? "video.mp4";

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
      alert("Something went wrong");
      setStatus("idle");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          YouTube Downloader
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          Paste a YouTube video URL to download it in HD.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setStatus("idle");
            }}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            required
          />

          <button
            type="submit"
            disabled={status === "downloading" || !url.trim()}
            className="rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "downloading"
              ? "Downloading..."
              : status === "done"
                ? "Download Again"
                : "Download"}
          </button>
        </form>

        {status === "downloading" && (
          <p className="mt-4 text-center text-sm text-zinc-400">
            This may take a moment...
          </p>
        )}

        {status === "done" && (
          <p className="mt-4 text-center text-sm text-green-400">
            Download started! Check your browser downloads.
          </p>
        )}
      </div>
    </main>
  );
}