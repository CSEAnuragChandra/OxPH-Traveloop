import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const FOLDER_NAME = "traveloop/profiles";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  return { cloudName, apiKey, apiSecret };
}

function createSignature(params: Record<string, string>, apiSecret: string) {
  const signatureBase = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(signatureBase + apiSecret)
    .digest("hex");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Only JPG, PNG, or WEBP images are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File must be 5MB or smaller." },
      { status: 400 }
    );
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const userId = (session.user as { id: string }).id;
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `profile_${userId}`;

  const paramsToSign = {
    folder: FOLDER_NAME,
    public_id: publicId,
    timestamp: timestamp.toString(),
    overwrite: "true",
  };

  const signature = createSignature(paramsToSign, apiSecret);
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const uploadForm = new FormData();
  uploadForm.append("file", dataUri);
  uploadForm.append("api_key", apiKey);
  uploadForm.append("timestamp", timestamp.toString());
  uploadForm.append("signature", signature);
  uploadForm.append("folder", FOLDER_NAME);
  uploadForm.append("public_id", publicId);
  uploadForm.append("overwrite", "true");

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: uploadForm }
  );

  const uploadResult = await uploadResponse.json().catch(() => null);

  if (!uploadResponse.ok || !uploadResult?.secure_url) {
    return NextResponse.json(
      { error: uploadResult?.error?.message || "Upload failed." },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { image: uploadResult.secure_url },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      languagePref: true,
    },
  });

  return NextResponse.json({ url: uploadResult.secure_url, user: updated });
}
