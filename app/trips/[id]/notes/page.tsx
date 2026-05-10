"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import NotesManager from "@/components/notes/NotesManager";

export default function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const tripRes = await fetch(`/api/trips/${tripId}`);
      if (tripRes.ok) {
        const data = await tripRes.json();
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

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <DashboardNavbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Itinerary
        </Link>
        
        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-1">Trip Utilities</p>
          <h1 className="text-4xl font-extrabold text-gray-900">Trip Notes</h1>
          <p className="text-gray-500 mt-1.5">Journal your experiences and save important details for {trip?.title}.</p>
        </div>

        <NotesManager 
          tripId={tripId} 
          stops={trip?.stops || []}
          initialNotes={trip?.notes || []}
        />
      </div>
    </main>
  );
}
