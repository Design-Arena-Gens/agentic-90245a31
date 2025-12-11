import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

import { generateSeoMetadata } from "@/lib/seo";
import { uploadToYouTube } from "@/lib/youtube";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ensureTempFile = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = file.name
    ? file.name.replace(/[^a-z0-9.\-_]/gi, "_")
    : `upload-${Date.now()}.mp4`;
  const filePath = path.join(os.tmpdir(), `${Date.now()}-${safeName}`);
  await fs.writeFile(filePath, buffer);
  return filePath;
};

const downloadFromLink = async (videoLink: string) => {
  const response = await fetch(videoLink);
  if (!response.ok) {
    throw new Error(`Failed to download video from link (${response.status})`);
  }

  const contentDisposition = response.headers.get("content-disposition");
  let filename = "remote-video.mp4";

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match) {
      filename = match[1];
    }
  } else {
    const urlPath = new URL(videoLink).pathname;
    const lastSegment = urlPath.split("/").pop();
    if (lastSegment) {
      filename = lastSegment;
    }
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const safeName = filename.replace(/[^a-z0-9.\-_]/gi, "_");
  const filePath = path.join(os.tmpdir(), `${Date.now()}-${safeName}`);
  await fs.writeFile(filePath, buffer);
  return { filePath, filename };
};

const cleanUp = async (filePath?: string | null) => {
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch {
    // noop
  }
};

export async function POST(request: Request) {
  let storedFilePath: string | null = null;
  try {
    const formData = await request.formData();

    const category = (formData.get("category") as string | null)?.trim();
    const language = (formData.get("language") as string | null)?.trim();
    const monetization = (formData.get("monetization") as string | null)?.trim();
    const schedule = (formData.get("schedule") as string | null)?.trim() || null;
    const videoLink = (formData.get("videoLink") as string | null)?.trim() || null;
    const videoFile = formData.get("videoFile");

    if (!category || !language || !monetization) {
      return NextResponse.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }

    let derivedFilename: string | null = null;

    if (videoFile instanceof File && videoFile.size > 0) {
      storedFilePath = await ensureTempFile(videoFile);
      derivedFilename = videoFile.name;
    } else if (videoLink) {
      const downloaded = await downloadFromLink(videoLink);
      storedFilePath = downloaded.filePath;
      derivedFilename = downloaded.filename;
    } else {
      return NextResponse.json(
        { success: false, error: "Provide either a video file or link." },
        { status: 400 }
      );
    }

    const metadata = generateSeoMetadata({
      category,
      language,
      monetization,
      schedule,
      videoLink,
      fileName: derivedFilename
    });

    const uploadResult = await uploadToYouTube({
      filePath: storedFilePath,
      metadata,
      category,
      language,
      monetization,
      schedule
    });

    const summary = {
      videoTitle: metadata.title,
      videoDescription: metadata.description,
      tags: metadata.tags,
      hashtags: metadata.hashtags,
      thumbnailPrompt: metadata.thumbnailPrompt,
      scheduledAt: schedule,
      videoId: uploadResult.videoId,
      videoUrl: uploadResult.url
    };

    return NextResponse.json({ success: true, summary });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload process failed.";
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  } finally {
    await cleanUp(storedFilePath);
  }
}
