import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/trips/[id]/clone — clone a public trip to the current user
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: sourceTripId } = await params;

  const sourceTrip = await prisma.trip.findFirst({
    where: { id: sourceTripId, isPublic: true },
    include: {
      stops: {
        include: { activities: true },
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!sourceTrip) {
    return NextResponse.json({ error: "Trip not found or not public" }, { status: 404 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Create cloned trip
  const clonedTrip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: `${sourceTrip.title} (Copy)`,
      description: sourceTrip.description,
      startDate: sourceTrip.startDate,
      endDate: sourceTrip.endDate,
      coverPhoto: sourceTrip.coverPhoto,
      totalBudget: sourceTrip.totalBudget,
      isPublic: false,
      stops: {
        create: sourceTrip.stops.map((stop) => ({
          cityName: stop.cityName,
          country: stop.country,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          orderIndex: stop.orderIndex,
          activities: {
            create: stop.activities.map((act) => ({
              title: act.title,
              description: act.description,
              type: act.type,
              cost: act.cost,
              duration: act.duration,
            })),
          },
        })),
      },
    },
  });

  return NextResponse.json({ tripId: clonedTrip.id }, { status: 201 });
}
