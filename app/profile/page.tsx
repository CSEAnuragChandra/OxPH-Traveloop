import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ProfileClient from "@/components/profile/ProfileClient";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85";

function formatLocation(city?: string | null, country?: string | null) {
  const parts = [city, country].filter(Boolean);
  return parts.length ? parts.join(", ") : "Custom itinerary";
}

export default async function ProfilePage() {
  const session = await getCurrentSession();

  if (!session?.user || !(session.user as { id?: string }).id) {
    redirect("/auth/signin");
  }

  const userId = (session.user as { id: string }).id;
  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      languagePref: true,
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  const upcomingTrips = await prisma.trip.findMany({
    where: {
      userId,
      startDate: { gte: now },
    },
    orderBy: { startDate: "asc" },
    take: 6,
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
        take: 1,
        select: { cityName: true, country: true },
      },
    },
  });

  const previousTrips = await prisma.trip.findMany({
    where: {
      userId,
      endDate: { lt: now },
    },
    orderBy: { endDate: "desc" },
    take: 6,
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
        take: 1,
        select: { cityName: true, country: true },
      },
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white">
      <DashboardNavbar />
      <ProfileClient
        user={user}
        upcomingTrips={upcomingTrips.map((trip) => ({
          id: trip.id,
          title: trip.title,
          startDate: trip.startDate.toISOString(),
          endDate: trip.endDate.toISOString(),
          coverPhoto: trip.coverPhoto || FALLBACK_COVER,
          location: formatLocation(
            trip.stops[0]?.cityName,
            trip.stops[0]?.country
          ),
        }))}
        previousTrips={previousTrips.map((trip) => ({
          id: trip.id,
          title: trip.title,
          startDate: trip.startDate.toISOString(),
          endDate: trip.endDate.toISOString(),
          coverPhoto: trip.coverPhoto || FALLBACK_COVER,
          location: formatLocation(
            trip.stops[0]?.cityName,
            trip.stops[0]?.country
          ),
        }))}
      />
    </main>
  );
}

