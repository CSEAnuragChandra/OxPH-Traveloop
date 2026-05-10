import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const trips = await prisma.trip.findMany({
    where: {
      isPublic: true,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { stops: { some: { cityName: { contains: query, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      title: true,
      description: true,
      coverPhoto: true,
      startDate: true,
      endDate: true,
      publicSlug: true,
      user: { select: { name: true, image: true } },
      stops: {
        orderBy: { orderIndex: "asc" },
        take: 3,
        select: { cityName: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(trips);
}
