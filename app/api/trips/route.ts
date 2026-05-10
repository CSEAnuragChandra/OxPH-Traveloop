import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required").max(120),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  totalBudget: z.number().positive().optional(),
  coverPhoto: z.string().url().optional(),
});

// GET /api/trips — fetch all trips for the authenticated user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const now = new Date();

  const trips = await prisma.trip.findMany({
    where: {
      OR: [{ userId: user.id }, { isPublic: true }],
    },
    include: {
      stops: {
        select: { cityName: true, country: true },
        orderBy: { orderIndex: "asc" },
      },
      _count: {
        select: { stops: true, expenses: true },
      },
    },
    orderBy: { startDate: "asc" },
  });

  // Compute status on the fly
  const tripsWithStatus = trips.map((trip) => {
    let status: "ongoing" | "upcoming" | "completed";
    if (trip.endDate < now) {
      status = "completed";
    } else if (trip.startDate <= now && trip.endDate >= now) {
      status = "ongoing";
    } else {
      status = "upcoming";
    }
    return { ...trip, status };
  });

  return NextResponse.json(tripsWithStatus);
}

// POST /api/trips — create a new trip
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createTripSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Validation failed" },
      { status: 422 }
    );
  }

  const { title, description, startDate, endDate, totalBudget, coverPhoto } =
    parsed.data;

  // Validate date logic
  if (new Date(endDate) <= new Date(startDate)) {
    return NextResponse.json(
      { error: "End date must be after start date" },
      { status: 422 }
    );
  }

  const trip = await prisma.trip.create({
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalBudget,
      coverPhoto,
      userId: user.id,
    },
  });

  return NextResponse.json(trip, { status: 201 });
}
