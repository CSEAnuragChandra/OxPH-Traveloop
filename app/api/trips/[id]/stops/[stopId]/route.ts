import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/trips/[id]/stops/[stopId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stopId } = await params;
  const body = await req.json();

  const stop = await prisma.stop.update({
    where: { id: stopId },
    data: {
      cityName: body.cityName,
      country: body.country,
      arrivalDate: body.arrivalDate ? new Date(body.arrivalDate) : undefined,
      departureDate: body.departureDate ? new Date(body.departureDate) : undefined,
      orderIndex: body.orderIndex,
    },
    include: { activities: true },
  });
  return NextResponse.json(stop);
}

// DELETE /api/trips/[id]/stops/[stopId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stopId } = await params;
  await prisma.stop.delete({ where: { id: stopId } });
  return NextResponse.json({ success: true });
}
