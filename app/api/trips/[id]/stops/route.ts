import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const stopSchema = z.object({
  cityName: z.string().min(1),
  country: z.string().optional(),
  arrivalDate: z.string().datetime(),
  departureDate: z.string().datetime(),
});

// GET /api/trips/[id]/stops
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params;
  const stops = await prisma.stop.findMany({
    where: { tripId },
    orderBy: { orderIndex: "asc" },
    include: { activities: { orderBy: { id: "asc" } } },
  });
  return NextResponse.json(stops);
}

// POST /api/trips/[id]/stops
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: tripId } = await params;
  const body = await req.json();
  const parsed = stopSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });

  // Auto-assign orderIndex
  const count = await prisma.stop.count({ where: { tripId } });
  const stop = await prisma.stop.create({
    data: {
      tripId,
      cityName: parsed.data.cityName,
      country: parsed.data.country,
      arrivalDate: new Date(parsed.data.arrivalDate),
      departureDate: new Date(parsed.data.departureDate),
      orderIndex: count,
    },
    include: { activities: true },
  });
  return NextResponse.json(stop, { status: 201 });
}
