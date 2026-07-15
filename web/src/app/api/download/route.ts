import ytdl from "@distube/ytdl-core";
import { Readable } from "node:stream";

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+/;

function nodeStreamToWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      nodeStream.on("data", (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on("end", () => {
        controller.close();
      });
      nodeStream.on("error", (err) => {
        controller.error(err);
      });
    },
  });
}

export async function POST(req: Request) {
  try {
    const { url, mode, quality } = await req.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    if (!YOUTUBE_REGEX.test(url)) {
      return Response.json({ error: "URL does not appear to be a YouTube video" }, { status: 400 });
    }

    if (!mode || (mode !== "video" && mode !== "audio")) {
      return Response.json({ error: "Invalid mode. Must be 'video' or 'audio'." }, { status: 400 });
    }

    let info: Awaited<ReturnType<typeof ytdl.getInfo>>;
    try {
      info = await ytdl.getInfo(url);
    } catch {
      return Response.json({ error: "Could not fetch video info. Check the URL and try again." }, { status: 400 });
    }

    const videoDetails = info.videoDetails;
    const safeTitle = (videoDetails.title || "video")
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 100);

    if (mode === "audio") {
      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      if (audioFormats.length === 0) {
        return Response.json({ error: "No audio formats available for this video" }, { status: 400 });
      }

      const bestAudio = audioFormats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];
      const ext = bestAudio.container === "webm" ? "webm" : "m4a";

      const stream = ytdl(url, { quality: bestAudio.itag });

      return new Response(nodeStreamToWebStream(stream), {
        headers: {
          "Content-Type": ext === "m4a" ? "audio/mp4" : "audio/webm",
          "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(safeTitle + "." + ext)}`,
        },
      });
    }

    const combinedFormats = info.formats.filter(
      (f) => f.hasVideo && f.hasAudio && f.container === "mp4"
    );

    if (combinedFormats.length === 0) {
      return Response.json(
        { error: "No downloadable video formats available for this video" },
        { status: 400 }
      );
    }

    let selectedFormat: ytdl.videoFormat;

    if (quality && quality !== "best") {
      const qualityLabel = quality.replace("p", "");
      selectedFormat = combinedFormats.find(
        (f) => f.qualityLabel && f.qualityLabel.includes(qualityLabel)
      ) || combinedFormats[combinedFormats.length - 1];
    } else {
      selectedFormat = combinedFormats.reduce((best, curr) => {
        const bestH = parseInt(best.qualityLabel?.replace("p", "") || "0", 10);
        const currH = parseInt(curr.qualityLabel?.replace("p", "") || "0", 10);
        return currH > bestH ? curr : best;
      });
    }

    const stream = ytdl(url, { quality: selectedFormat.itag });

    return new Response(nodeStreamToWebStream(stream), {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(safeTitle + ".mp4")}`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
