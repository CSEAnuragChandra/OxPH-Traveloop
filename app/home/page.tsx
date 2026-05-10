import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardHero from "@/components/dashboard/DashboardHero";
import TopRegions from "@/components/dashboard/TopRegions";
import MyTrips from "@/components/dashboard/MyTrips";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard - Traveloop",
  description: "Manage your travel itineraries and explore destinations.",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85";

function formatRange(startDate: Date, endDate: Date) {
  const start = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(startDate);
  const end = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(endDate);
  return `${start} - ${end}`;
}

function getStatus(startDate: Date, endDate: Date) {
  const now = new Date();
  if (endDate < now) {
    return "Completed";
  }
  if (startDate > now) {
    return "Upcoming";
  }
  return "Ongoing";
}

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session?.user || !(session.user as { id?: string }).id) {
    redirect("/auth/signin");
  }

  const userId = (session.user as { id: string }).id;
  const userTrips = await prisma.trip.findMany({
    where: { userId },
    orderBy: { startDate: "asc" },
    include: {
      stops: {
        orderBy: { orderIndex: "asc" },
        select: { cityName: true, country: true },
      },
    },
    take: 6,
  });

  const trips = userTrips.map((trip) => ({
    id: trip.id,
    title: trip.title,
    destination: trip.stops.length
      ? `${trip.stops[0].cityName}, ${trip.stops[0].country ?? ""}`.trim()
      : "Custom itinerary",
    dates: formatRange(trip.startDate, trip.endDate),
    stops: trip.stops.length,
    status: getStatus(trip.startDate, trip.endDate),
    image: trip.coverPhoto || FALLBACK_IMAGE,
  }));

  const regionMap = new Map<string, { name: string; country: string; count: number; image: string }>();
  userTrips.forEach((trip) => {
    const stop = trip.stops[0];
    if (!stop?.cityName || !stop?.country) {
      return;
    }
    const key = `${stop.cityName}-${stop.country}`;
    const current = regionMap.get(key);
    const image = trip.coverPhoto || FALLBACK_IMAGE;
    if (!current) {
      regionMap.set(key, {
        name: stop.cityName,
        country: stop.country,
        count: 1,
        image,
      });
    } else {
      regionMap.set(key, {
        ...current,
        count: current.count + 1,
        image: current.image || image,
      });
    }
  });

  const regions = Array.from(regionMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)
    .map((region) => ({
      id: `${region.name}-${region.country}`,
      name: region.name,
      country: region.country,
      image: region.image,
      rating: Number((4.3 + Math.min(region.count, 5) * 0.1).toFixed(1)),
      tripsPlanned: `${region.count} trips`,
    }));
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />
      
      {/* Main Content Area */}
      <main className="flex-1">
        <DashboardHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <MyTrips trips={trips} />
          <TopRegions regions={regions} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
