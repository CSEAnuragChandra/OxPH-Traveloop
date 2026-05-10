"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, Edit3, MapPin, Calendar, Wallet } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DayTimeline from "@/components/itinerary/DayTimeline";
import { Button } from "@/components/ui/button";

interface Trip {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  totalBudget?: number | null;
  coverPhoto?: string | null;
  stops: any[];
}

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data);
      }
      setLoading(false);
    }
    load();
  }, [tripId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="min-h-screen bg-gray-50">
        <DashboardNavbar />
        <div className="text-center py-20">Trip not found</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <DashboardNavbar />

      {/* Hero Banner */}
      <div className="relative h-[30vh] min-h-[250px] w-full">
        {trip.coverPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.coverPhoto} alt={trip.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-orange-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <Link href="/trips" className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors mb-4 group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to My Trips
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            {trip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium">
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-orange-400" />
              {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
              <MapPin className="w-4 h-4 text-orange-400" />
              {trip.stops.length} Destination{trip.stops.length !== 1 ? 's' : ''}
            </span>
            {trip.totalBudget && (
              <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                <Wallet className="w-4 h-4 text-orange-400" />
                ${trip.totalBudget.toLocaleString()} Budget
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          
          {/* Main Content - Timeline */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Your Itinerary</h2>
              <Link href={`/trips/${tripId}/builder`}>
                <Button variant="outline" className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50">
                  <Edit3 className="w-4 h-4" /> Edit Plan
                </Button>
              </Link>
            </div>

            {trip.stops.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Start building your itinerary by adding destinations and activities.
                </p>
                <Link href={`/trips/${tripId}/builder`}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                    Go to Builder
                  </Button>
                </Link>
              </div>
            ) : (
              <DayTimeline tripId={tripId} initialStops={trip.stops} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Trip Overview</h3>
              {trip.description ? (
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{trip.description}</p>
              ) : (
                <p className="text-sm text-gray-400 italic mb-6">No description provided.</p>
              )}
              
              <div className="space-y-3">
                <Link href={`/trips/${tripId}/budget`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors group cursor-pointer border border-transparent hover:border-orange-100">
                    <span className="font-medium text-gray-700 group-hover:text-orange-700">Budget Tracker</span>
                    <span className="text-xs bg-white shadow-sm px-2 py-1 rounded font-bold text-gray-500">View</span>
                  </div>
                </Link>
                <Link href={`/trips/${tripId}/packing`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors group cursor-pointer border border-transparent hover:border-orange-100">
                    <span className="font-medium text-gray-700 group-hover:text-orange-700">Packing List</span>
                    <span className="text-xs bg-white shadow-sm px-2 py-1 rounded font-bold text-gray-500">View</span>
                  </div>
                </Link>
                <Link href={`/trips/${tripId}/notes`} className="block">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors group cursor-pointer border border-transparent hover:border-orange-100">
                    <span className="font-medium text-gray-700 group-hover:text-orange-700">Trip Notes</span>
                    <span className="text-xs bg-white shadow-sm px-2 py-1 rounded font-bold text-gray-500">View</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
