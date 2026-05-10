import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params;
  const items = await prisma.checklistItem.findMany({
    where: { tripId },
    orderBy: { id: "asc" },
  });
  return NextResponse.json(items);
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

  const item = await prisma.checklistItem.create({
    data: {
      tripId,
      content: body.content,
      category: body.category || "General",
      isPacked: false,
    },
  });
  return NextResponse.json(item, { status: 201 });
}
