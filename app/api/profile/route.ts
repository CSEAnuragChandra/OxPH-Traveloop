import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth/next";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const profileSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  image: z.string().url().nullable().optional(),
  languagePref: z.string().min(2).max(10).nullable().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      languagePref: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid profile data", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updates: {
    name?: string | null;
    image?: string | null;
    languagePref?: string | null;
  } = {};

  if (parsed.data.name !== undefined) {
    updates.name = parsed.data.name;
  }

  if (parsed.data.image !== undefined) {
    updates.image = parsed.data.image;
  }

  if (parsed.data.languagePref !== undefined) {
    updates.languagePref = parsed.data.languagePref;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json(
      { error: "No profile fields to update" },
      { status: 400 }
    );
  }

  const userId = (session.user as { id: string }).id;
  const updated = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      languagePref: true,
    },
  });

  return NextResponse.json(updated);
}
