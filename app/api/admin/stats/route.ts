import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map(e => e.trim().toLowerCase());

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalTrips,
    publicTrips,
    totalExpenses,
    totalActivities,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.trip.count({ where: { isPublic: true } }),
    prisma.expense.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.activity.count(),
    prisma.user.findMany({
      orderBy: { id: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, emailVerified: true, image: true, _count: { select: { trips: true } } },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalUsers,
      totalTrips,
      publicTrips,
      totalExpensesAmount: totalExpenses._sum.amount ?? 0,
      totalExpenseCount: totalExpenses._count,
      totalActivities,
    },
    recentUsers,
  });
}
