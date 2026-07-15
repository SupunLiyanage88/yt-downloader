import { mkdtemp, rm, open, readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

export async function POST(req: Request) {
  let tempDir: string | null = null;

  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "Missing or invalid URL" }, { status: 400 });
    }

    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return Response.json({ error: "URL does not appear to be a YouTube video" }, { status: 400 });
    }

    tempDir = await mkdtemp(join(tmpdir(), "yt-dl-"));

    const projectRoot = join(process.cwd(), "..");
    const pythonExe = join(projectRoot, ".venv", "Scripts", "python.exe");

    await new Promise<void>((resolve, reject) => {
      const proc = spawn(pythonExe, [join(projectRoot, "yt_downloader.py"), url], {
        cwd: tempDir!,
        env: { ...process.env, PYTHONIOENCODING: "utf-8" },
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stderr = "";

      proc.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });

      proc.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(stderr.trim() || `Python process exited with code ${code}`));
        }
      });

      proc.on("error", (err) => {
        reject(new Error(`Failed to start Python: ${err.message}`));
      });
    });

    const files = await readdir(tempDir);
    const videoFile = files.find((f) =>
      /\.(mp4|mkv|webm|mov)$/i.test(f)
    );

    if (!videoFile) {
      throw new Error("No video file was downloaded");
    }

    const filePath = join(tempDir, videoFile);
    const fileHandle = await open(filePath);
    const ext = videoFile.split(".").pop() ?? "mp4";

    return new Response(fileHandle.readableWebStream() as ReadableStream<Uint8Array>, {
      headers: {
        "Content-Type": `video/${ext}`,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(videoFile)}`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  } finally {
    if (tempDir) {
      rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}