"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Plus, MapPin, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StopSection, { type Stop, type Activity } from "@/components/itinerary/StopSection";
import AddActivityModal from "@/components/itinerary/AddActivityModal";
import type { ActivityItemData } from "@/components/itinerary/ActivityItem";

interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  stops: Stop[];
}

export default function BuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tripId } = use(params);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New stop form
  const [addingStop, setAddingStop] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newArrival, setNewArrival] = useState("");
  const [newDeparture, setNewDeparture] = useState("");

  // Activity modal
  const [actModalOpen, setActModalOpen] = useState(false);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<ActivityItemData | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/trips/${tripId}`);
      if (res.ok) {
        const data = await res.json();
        setTrip(data);
        setStops(data.stops || []);
      }
      setLoading(false);
    }
    load();
  }, [tripId]);

  const handleAddStop = async () => {
    if (!newCity || !newArrival || !newDeparture) return;
    setSaving(true);
    const res = await fetch(`/api/trips/${tripId}/stops`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cityName: newCity,
        country: newCountry || undefined,
        arrivalDate: new Date(newArrival).toISOString(),
        departureDate: new Date(newDeparture).toISOString(),
      }),
    });
    if (res.ok) {
      const stop = await res.json();
      setStops((prev) => [...prev, stop]);
      setNewCity(""); setNewCountry(""); setNewArrival(""); setNewDeparture("");
      setAddingStop(false);
    }
    setSaving(false);
  };

  const handleDeleteStop = async (stopId: string) => {
    await fetch(`/api/trips/${tripId}/stops/${stopId}`, { method: "DELETE" });
    setStops((prev) => prev.filter((s) => s.id !== stopId));
  };

  const handleUpdateStop = async (stopId: string, data: Partial<Stop>) => {
    const res = await fetch(`/api/trips/${tripId}/stops/${stopId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setStops((prev) => prev.map((s) => (s.id === stopId ? updated : s)));
    }
  };

  const openAddActivity = (stopId: string) => {
    setActiveStopId(stopId);
    setEditingActivity(null);
    setActModalOpen(true);
  };

  const handleActivitySaved = (activity: ActivityItemData, isEdit: boolean) => {
    if (!activeStopId) return;
    setStops((prev) =>
      prev.map((stop) => {
        if (stop.id !== activeStopId) return stop;
        const activities = isEdit
          ? stop.activities.map((a) => (a.id === activity.id ? (activity as Activity) : a))
          : [...stop.activities, activity as Activity];
        return { ...stop, activities };
      })
    );
  };

  const handleDeleteActivity = async (stopId: string, actId: string) => {
    await fetch(`/api/trips/${tripId}/stops/${stopId}/activities/${actId}`, { method: "DELETE" });
    setStops((prev) =>
      prev.map((s) =>
        s.id === stopId ? { ...s, activities: s.activities.filter((a) => a.id !== actId) } : s
      )
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-white">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-white">
      <DashboardNavbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Itinerary
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-orange-500 uppercase tracking-wide mb-1">Itinerary Builder</p>
            <h1 className="text-4xl font-extrabold text-gray-900">{trip?.title ?? "Your Trip"}</h1>
            <p className="text-gray-500 mt-1.5">Add destinations and activities for your trip.</p>
          </div>
          <Link href={`/trips/${tripId}`}>
            <Button variant="outline" className="gap-2 rounded-xl">
              <Eye className="w-4 h-4" /> View Itinerary
            </Button>
          </Link>
        </div>

        {/* Stops */}
        <div className="space-y-4">
          <AnimatePresence>
            {stops.map((stop, i) => (
              <StopSection
                key={stop.id}
                stop={stop}
                index={i}
                tripId={tripId}
                onDelete={handleDeleteStop}
                onUpdate={handleUpdateStop}
                onAddActivity={(stopId) => {
                  setActiveStopId(stopId);
                  openAddActivity(stopId);
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Add Stop Form */}
        <AnimatePresence>
          {addingStop ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-4 bg-white rounded-2xl border border-orange-200 shadow-sm p-5 space-y-4"
            >
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                New Destination
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="new-city">City *</Label>
                  <Input id="new-city" value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="e.g. Paris" autoFocus />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-country">Country</Label>
                  <Input id="new-country" value={newCountry} onChange={(e) => setNewCountry(e.target.value)} placeholder="e.g. France" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-arrival">Arrival Date *</Label>
                  <Input id="new-arrival" type="date" value={newArrival} onChange={(e) => setNewArrival(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new-departure">Departure Date *</Label>
                  <Input id="new-departure" type="date" value={newDeparture} onChange={(e) => setNewDeparture(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddStop} disabled={saving || !newCity || !newArrival || !newDeparture}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Add Destination
                </Button>
                <Button variant="outline" onClick={() => setAddingStop(false)} className="flex-1">Cancel</Button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setAddingStop(true)}
              className="mt-4 w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50 rounded-2xl text-gray-500 hover:text-orange-600 font-medium transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Another Section
            </motion.button>
          )}
        </AnimatePresence>

        {stops.length > 0 && (
          <div className="mt-8 flex justify-end">
            <Link href={`/trips/${tripId}`}>
              <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl px-8 shadow-md shadow-orange-200 gap-2">
                <Eye className="w-4 h-4" />
                View Full Itinerary
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Activity Modal */}
      {actModalOpen && activeStopId && (
        <AddActivityModal
          open={actModalOpen}
          onClose={() => { setActModalOpen(false); setEditingActivity(null); }}
          stopId={activeStopId}
          tripId={tripId}
          editingActivity={editingActivity}
          onSaved={handleActivitySaved}
        />
      )}
    </main>
  );
}
