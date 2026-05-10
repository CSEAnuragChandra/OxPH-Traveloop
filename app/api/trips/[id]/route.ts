import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/trips/[id] — fetch a single trip with all stops and activities
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const trip = await prisma.trip.findFirst({
    where: { id },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
        include: {
          activities: { orderBy: { id: "asc" } },
        },
      },
      expenses: { orderBy: { date: "desc" } },
      checklist: { orderBy: { id: "asc" } },
      notes: { orderBy: { date: "desc" }, include: { stop: true } },
      _count: { select: { expenses: true, checklist: true, notes: true } },
    },
  });

  if (!trip) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  return NextResponse.json(trip);
}

// PUT /api/trips/[id] — update trip metadata
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const trip = await prisma.trip.updateMany({
    where: { id, userId: user.id },
    data: {
      title: body.title,
      description: body.description,
      totalBudget: body.totalBudget,
      coverPhoto: body.coverPhoto,
    },
  });

  if (trip.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
