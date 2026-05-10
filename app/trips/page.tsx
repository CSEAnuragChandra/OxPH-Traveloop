"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Luggage, Filter } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import TripCard, { type TripCardProps } from "@/components/trips/TripCard";
import { Button } from "@/components/ui/button";

type StatusFilter = "all" | "ongoing" | "upcoming" | "completed";

const FILTER_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All Trips" },
  { key: "ongoing", label: "Ongoing" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function TripsPage() {
  const [trips, setTrips] = useState<TripCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await fetch("/api/trips");
        if (!res.ok) throw new Error("Failed to load trips");
        const data = await res.json();
        setTrips(data);
      } catch {
        setError("Could not load your trips. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  const filtered =
    activeFilter === "all"
      ? trips
      : trips.filter((t) => t.status === activeFilter);

  const counts = {
    all: trips.length,
    ongoing: trips.filter((t) => t.status === "ongoing").length,
    upcoming: trips.filter((t) => t.status === "upcoming").length,
    completed: trips.filter((t) => t.status === "completed").length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-white">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-sm font-semibold text-orange-500 tracking-wide uppercase mb-1">
              Your Adventures
            </p>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              My Trips
            </h1>
            <p className="mt-2 text-gray-500">
              {trips.length === 0
                ? "No trips yet — start planning your first adventure!"
                : `${trips.length} trip${trips.length !== 1 ? "s" : ""} planned`}
            </p>
          </div>

          <Link href="/trips/new">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full px-6 shadow-md shadow-orange-200 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Plan a New Trip
            </Button>
          </Link>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-2 mb-8 flex-wrap"
        >
          <Filter className="w-4 h-4 text-gray-400 mr-1" />
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeFilter === tab.key
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  activeFilter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-100 animate-pulse h-72"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-orange-500 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center py-24 gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
              <Luggage className="w-12 h-12 text-orange-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeFilter === "all"
                  ? "No trips yet"
                  : `No ${activeFilter} trips`}
              </h2>
              <p className="text-gray-500 mt-2 max-w-sm">
                {activeFilter === "all"
                  ? "Your travel adventures start here. Plan your first trip and Traveloop will take care of the rest."
                  : `You don't have any ${activeFilter} trips right now. Check the other filters.`}
              </p>
            </div>
            {activeFilter === "all" && (
              <Link href="/trips/new">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full px-8 shadow-md shadow-orange-200 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Plan Your First Trip
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((trip) => (
                <motion.div key={trip.id} variants={item}>
                  <TripCard {...trip} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </main>
  );
}
