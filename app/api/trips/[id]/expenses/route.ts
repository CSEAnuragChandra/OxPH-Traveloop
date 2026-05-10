import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: tripId } = await params;
  const expenses = await prisma.expense.findMany({
    where: { tripId },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(expenses);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: tripId } = await params;
  const body = await req.json();

  if (!body.category || !body.amount) {
    return NextResponse.json({ error: "Category and amount are required" }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: {
      tripId,
      category: body.category,
      amount: parseFloat(body.amount),
      description: body.description,
      date: body.date ? new Date(body.date) : new Date(),
    },
  });
  return NextResponse.json(expense, { status: 201 });
}
