import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Clock, DollarSign, Globe, User } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface Activity {
  id: string;
  title: string;
  type: string;
  description?: string | null;
  duration?: number | null;
  cost?: number | null;
}

interface Stop {
  id: string;
  cityName: string;
  country?: string | null;
  arrivalDate: Date;
  departureDate: Date;
  activities: Activity[];
}

const TYPE_COLORS: Record<string, string> = {
  Sightseeing: "bg-blue-50 text-blue-700 border-blue-100",
  Food: "bg-amber-50 text-amber-700 border-amber-100",
  Adventure: "bg-green-50 text-green-700 border-green-100",
  Accommodation: "bg-purple-50 text-purple-700 border-purple-100",
  Transport: "bg-gray-50 text-gray-600 border-gray-100",
  Shopping: "bg-pink-50 text-pink-700 border-pink-100",
  Culture: "bg-indigo-50 text-indigo-700 border-indigo-100",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await prisma.trip.findFirst({
    where: { publicSlug: slug, isPublic: true },
    select: { title: true, description: true },
  });
  return {
    title: trip ? `${trip.title} - Traveloop` : "Shared Trip - Traveloop",
    description: trip?.description ?? "Explore this shared trip itinerary on Traveloop.",
  };
}

export default async function SharedTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const trip = await prisma.trip.findFirst({
    where: { publicSlug: slug, isPublic: true },
    include: {
      user: { select: { name: true, image: true } },
      stops: {
        orderBy: { orderIndex: "asc" },
        include: { activities: { orderBy: { id: "asc" } } },
      },
    },
  });

  if (!trip) notFound();

  const totalDays = Math.round(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-white" />
            </div>
            Traveloop
          </Link>
          <Link
            href="/auth/signin"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Sign in to clone this trip →
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px]">
        {trip.coverPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.coverPhoto} alt={trip.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-amber-300 to-orange-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex items-center gap-2 text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">
            <Globe className="w-3.5 h-3.5" /> Shared Itinerary
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{trip.title}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-white/90">
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              {trip.startDate.toLocaleDateString()} — {trip.endDate.toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              {trip.stops.length} Destination{trip.stops.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              {totalDays} Day{totalDays !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Author & Description */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden shrink-0">
              {trip.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={trip.user.image} alt={trip.user.name ?? ""} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-orange-500" />
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Planned by</p>
              <p className="font-bold text-gray-900">{trip.user.name ?? "A Traveloop User"}</p>
            </div>
          </div>
          {trip.description && (
            <p className="text-gray-600 leading-relaxed text-sm border-t border-gray-50 pt-4">{trip.description}</p>
          )}
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-orange-200 ml-4 space-y-10 pb-4">
          {(trip.stops as unknown as Stop[]).map((stop, i) => (
            <div key={stop.id} className="relative pl-8">
              {/* Node */}
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-orange-500 shadow-sm" />

              {/* Stop header */}
              <div className="mb-5">
                <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">
                  Destination {i + 1}
                </p>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  {stop.cityName}
                  {stop.country && <span className="text-gray-400 font-normal text-lg">, {stop.country}</span>}
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(stop.arrivalDate).toLocaleDateString()} — {new Date(stop.departureDate).toLocaleDateString()}
                </p>
              </div>

              {/* Activities */}
              {stop.activities.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No activities listed.</p>
              ) : (
                <div className="space-y-3">
                  {stop.activities.map((act) => {
                    const typeClass = TYPE_COLORS[act.type] ?? "bg-orange-50 text-orange-700 border-orange-100";
                    return (
                      <div key={act.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-semibold text-gray-900">{act.title}</h3>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${typeClass}`}>
                            {act.type}
                          </span>
                        </div>
                        {act.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">{act.description}</p>
                        )}
                        <div className="flex gap-4 text-xs font-medium text-gray-400">
                          {act.duration != null && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {act.duration >= 60
                                ? `${Math.floor(act.duration / 60)}h${act.duration % 60 ? ` ${act.duration % 60}m` : ""}`
                                : `${act.duration}m`}
                            </span>
                          )}
                          {act.cost != null && act.cost > 0 && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" />
                              {act.cost.toLocaleString()}
                            </span>
                          )}
                          {act.cost === 0 && (
                            <span className="text-green-600 font-semibold">Free</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 text-center shadow-lg shadow-orange-200/50">
          <h3 className="text-2xl font-extrabold text-white mb-2">Love this itinerary?</h3>
          <p className="text-orange-50/90 text-sm mb-6 max-w-sm mx-auto">
            Sign up for free and clone this trip to customize it for your own adventure.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-sm"
          >
            Get Started Free →
          </Link>
        </div>
      </div>
    </main>
  );
}
