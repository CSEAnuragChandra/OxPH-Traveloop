import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  cost: z.number().nonnegative().optional(),
  duration: z.number().int().positive().optional(),
});

// GET /api/trips/[id]/stops/[stopId]/activities
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  const { stopId } = await params;
  const activities = await prisma.activity.findMany({ where: { stopId }, orderBy: { id: "asc" } });
  return NextResponse.json(activities);
}

// POST /api/trips/[id]/stops/[stopId]/activities
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { stopId } = await params;
  const body = await req.json();
  const parsed = activitySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 422 });

  const activity = await prisma.activity.create({
    data: {
      stopId,
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      cost: parsed.data.cost,
      duration: parsed.data.duration,
    },
  });
  return NextResponse.json(activity, { status: 201 });
}
