import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; expenseId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { expenseId } = await params;
  const body = await req.json();

  const expense = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      category: body.category,
      amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
      description: body.description,
      date: body.date ? new Date(body.date) : undefined,
    },
  });
  return NextResponse.json(expense);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; expenseId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { expenseId } = await params;
  await prisma.expense.delete({ where: { id: expenseId } });
  return NextResponse.json({ success: true });
}
