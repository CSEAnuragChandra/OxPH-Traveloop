"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Search, MapPin, Calendar, Users, Copy, Eye, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SharedTrip {
  id: string;
  title: string;
  description?: string | null;
  coverPhoto?: string | null;
  startDate: string;
  endDate: string;
  user: { name?: string | null; image?: string | null };
  stops: { cityName: string }[];
}

export default function CommunityFeed() {
  const { data: session } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState<SharedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cloning, setCloning] = useState<string | null>(null);
  const [debouncedQuery] = useDebounce(query, 400);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    const res = await fetch(`/api/community/trips?${params}`);
    const data = await res.json();
    setTrips(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [debouncedQuery]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const handleClone = async (tripId: string) => {
    if (!session) { router.push("/auth/signin"); return; }
    setCloning(tripId);
    const res = await fetch(`/api/trips/${tripId}/clone`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      router.push(`/trips/${data.tripId}/builder`);
    }
    setCloning(null);
  };

  const nightCount = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search destinations, trip names..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl text-base border-gray-200 focus:border-orange-400 focus:ring-orange-200"
          />
        </div>
      </div>

      {/* Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No public trips found</h3>
          <p className="text-sm text-gray-500 mt-1">
            {query ? "No trips match your search. Try different keywords." : "No itineraries have been shared yet. Be the first!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
              {/* Cover */}
              <div className="relative h-52 overflow-hidden bg-orange-100">
                {trip.coverPhoto ? (
                  <img src={trip.coverPhoto} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
                    <span className="text-6xl opacity-30">✈️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Author */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center overflow-hidden">
                    {trip.user.image ? (
                      <img src={trip.user.image} alt={trip.user.name || ""} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {trip.user.name?.[0] ?? "A"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-white/90">
                    {trip.user.name || "Traveler"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-xl mb-2 leading-tight line-clamp-1">{trip.title}</h3>

                {/* Stops */}
                {trip.stops.length > 0 && (
                  <p className="text-xs font-medium text-orange-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {trip.stops.map(s => s.cityName).join(" → ")}
                    {trip.stops.length > 3 && " ..."}
                  </p>
                )}

                {trip.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{trip.description}</p>
                )}

                <div className="flex items-center justify-between text-xs font-medium text-gray-400 pt-4 border-t border-gray-50 mt-auto">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {nightCount(trip.startDate, trip.endDate)} nights
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/trips/${trip.id}`)}
                      className="rounded-full text-xs h-8 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleClone(trip.id)}
                      disabled={cloning === trip.id}
                      className="rounded-full text-xs h-8 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      {cloning === trip.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      Clone
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
