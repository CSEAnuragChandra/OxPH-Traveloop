"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, MoreHorizontal, Plus, Route } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
type TripCard = {
  id: string;
  title: string;
  destination: string;
  dates: string;
  stops: number;
  status: "Upcoming" | "Ongoing" | "Completed";
  image: string;
};

const statusColors: Record<TripCard["status"], string> = {
  Upcoming: "bg-blue-500",
  Ongoing: "bg-emerald-500",
  Completed: "bg-gray-700",
};

export default function MyTrips({ trips = [] }: { trips?: TripCard[] }) {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Your Trips
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Continue planning or look back at past adventures.
          </p>
        </div>
        <Link
          href="/trips"
          className="text-orange-600 font-medium hover:text-orange-700 transition-colors"
        >
          View all trips
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Trip Card */}
        <Link href="/trips/new" className="block">
          <motion.div
            whileHover={{ y: -5 }}
            className="h-full min-h-[300px] border-2 border-dashed border-gray-200 hover:border-orange-400 bg-gray-50/50 hover:bg-orange-50/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 cursor-pointer group"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-orange-500 transition-all duration-300">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
              Plan a new trip
            </h3>
            <p className="text-sm text-gray-500">
              Start building your next itinerary from scratch or get inspired.
            </p>
          </motion.div>
        </Link>

        {/* Existing Trips */}
        {trips.map((trip) => (
          <motion.div
            key={trip.id}
            whileHover={{ y: -5 }}
            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Image Header */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={trip.image}
                alt={trip.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  className={`${statusColors[trip.status]} text-white border-none px-3 py-1 text-xs font-semibold`}
                >
                  {trip.status}
                </Badge>
              </div>
              <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-gray-900 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                {trip.title}
              </h3>
              
              <div className="flex items-center text-gray-500 text-sm mb-4 gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>{trip.destination}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-orange-500 mr-2" />
                  <span className="truncate">{trip.dates}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Route className="w-4 h-4 text-orange-500 mr-2" />
                  <span>{trip.stops} Stops</span>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="px-5 pb-5 pt-2">
              <Link href={`/trips/${trip.id}`}>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl">
                  View Itinerary
                </Button>
              </Link>
            </div>
          </motion.div>
        ))}
        {!trips.length && (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
            No trips yet. Start planning to see your itineraries here.
          </div>
        )}
      </div>
    </section>
  );
}
