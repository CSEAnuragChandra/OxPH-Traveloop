import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/trips/[id]/share — toggle public sharing and generate a slug
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existing = await prisma.trip.findFirst({
    where: { id, userId: user.id },
    select: { isPublic: true, publicSlug: true },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const makePublic = !existing.isPublic;
  // Generate slug if going public and none exists
  const slug = makePublic
    ? (existing.publicSlug ?? `trip-${id.slice(0, 8)}-${Date.now().toString(36)}`)
    : existing.publicSlug;

  await prisma.trip.update({
    where: { id },
    data: { isPublic: makePublic, publicSlug: slug },
  });

  return NextResponse.json({ isPublic: makePublic, publicSlug: makePublic ? slug : null });
}
