"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Calendar, Mail, Phone, Pencil, Lock } from "lucide-react";
import { signOut } from "next-auth/react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";

const upcomingTrips = [
  {
    title: "Kyoto Autumn Escape",
    location: "Kyoto, Japan",
    date: "Oct 18 - Oct 26, 2026",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&q=85",
  },
  {
    title: "Amalfi Coast Retreat",
    location: "Amalfi, Italy",
    date: "Nov 04 - Nov 11, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85",
  },
  {
    title: "Morocco Desert Nights",
    location: "Merzouga, Morocco",
    date: "Dec 12 - Dec 19, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85",
  },
];

const previousTrips = [
  {
    title: "Cape Town City Lights",
    location: "Cape Town, South Africa",
    date: "May 09 - May 16, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85",
  },
  {
    title: "Banff Alpine Trails",
    location: "Banff, Canada",
    date: "Feb 21 - Feb 28, 2026",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85",
  },
  {
    title: "Lisbon Coastal Break",
    location: "Lisbon, Portugal",
    date: "Dec 06 - Dec 12, 2025",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=85",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white">
      <DashboardNavbar />

      <section className="relative pt-28 pb-16">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 right-20 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
          <div className="absolute top-36 left-12 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            <p className="text-sm font-semibold text-orange-500">Profile</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              Your Travel Profile
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Keep your traveler details up to date and track every journey from
              one space.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_2fr]">
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 p-6"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative h-28 w-28">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=85"
                    alt="User profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Aria Bennett
                  </h2>
                  <p className="text-sm text-gray-500">Premium Explorer</p>
                </div>
                <div className="w-full rounded-2xl bg-orange-50/80 border border-orange-100 p-4 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-orange-500" />
                    aria.bennett@traveloop.com
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-orange-500" />
                    +1 (555) 204-7812
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    Seattle, USA
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full">
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full rounded-full">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Travel Preferences
              </h3>
              <p className="mt-2 text-gray-600">
                Curated preferences help Traveloop build the right itinerary for
                every mood.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  "Boutique stays",
                  "Local food tours",
                  "Sunrise hikes",
                  "City photography",
                  "Wellness retreats",
                  "Cultural festivals",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-3 text-sm font-medium text-gray-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-slate-950 text-white px-5 py-4">
                <p className="text-sm text-white/70">Next milestone</p>
                <p className="mt-2 text-xl font-semibold">
                  3 trips away from Elite Explorer
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Upcoming Trips
              </h2>
              <p className="text-gray-600">
                Keep an eye on what is next in your calendar.
              </p>
            </div>
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
            className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {upcomingTrips.map((trip) => (
              <motion.div
                key={trip.title}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 24px 45px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.3 }}
                className="group overflow-hidden rounded-3xl bg-white border border-orange-100"
              >
                <div className="relative h-44">
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {trip.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {trip.location}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    {trip.date}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full rounded-full"
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Previous Trips
            </h2>
            <p className="text-gray-600">
              Relive the journeys you already conquered.
            </p>
          </div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.08 }}
            className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {previousTrips.map((trip) => (
              <motion.div
                key={trip.title}
                variants={cardVariants}
                whileHover={{ y: -8, boxShadow: "0 24px 45px rgba(0,0,0,0.12)" }}
                transition={{ duration: 0.3 }}
                className="group overflow-hidden rounded-3xl bg-white border border-orange-100"
              >
                <div className="relative h-44">
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {trip.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    {trip.location}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    {trip.date}
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 w-full rounded-full"
                  >
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
