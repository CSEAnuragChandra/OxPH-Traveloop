import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT /api/trips/[id]/stops/[stopId]/activities/[actId]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string; actId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { actId } = await params;
  const body = await req.json();

  const activity = await prisma.activity.update({
    where: { id: actId },
    data: {
      title: body.title,
      description: body.description,
      type: body.type,
      cost: body.cost,
      duration: body.duration,
    },
  });
  return NextResponse.json(activity);
}

// DELETE /api/trips/[id]/stops/[stopId]/activities/[actId]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string; actId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { actId } = await params;
  await prisma.activity.delete({ where: { id: actId } });
  return NextResponse.json({ success: true });
}
