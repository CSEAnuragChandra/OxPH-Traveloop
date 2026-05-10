import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/share/[slug] — public, no auth required
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const trip = await prisma.trip.findFirst({
    where: { publicSlug: slug, isPublic: true },
    include: {
      user: { select: { name: true, image: true } },
      stops: {
        orderBy: { orderIndex: "asc" },
        include: {
          activities: { orderBy: { id: "asc" } },
        },
      },
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found or not public" }, { status: 404 });
  }

  return NextResponse.json(trip);
}
