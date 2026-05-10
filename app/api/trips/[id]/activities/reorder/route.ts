import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: tripId } = await params;
  const body = await req.json();
  const { activityId, newStopId } = body;

  if (!activityId || !newStopId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify the new stop belongs to this trip
  const stop = await prisma.stop.findFirst({
    where: { id: newStopId, tripId },
  });

  if (!stop) {
    return NextResponse.json({ error: "Invalid stop" }, { status: 400 });
  }

  const activity = await prisma.activity.update({
    where: { id: activityId },
    data: { stopId: newStopId },
  });

  return NextResponse.json(activity);
}
