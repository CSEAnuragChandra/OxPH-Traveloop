import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params;
  const notes = await prisma.note.findMany({
    where: { tripId },
    include: { stop: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(notes);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: tripId } = await params;
  const body = await req.json();

  if (!body.content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      tripId,
      content: body.content,
      stopId: body.stopId || null,
      date: new Date(),
    },
    include: { stop: true },
  });
  return NextResponse.json(note, { status: 201 });
}
