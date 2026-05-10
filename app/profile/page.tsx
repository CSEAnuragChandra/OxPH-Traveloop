"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Calendar, Mail, User, LogOut, Pencil,
  Globe, Map, Settings, Share2, CheckCircle2, Lock,
} from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { Button } from "@/components/ui/button";

const cardVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

interface Trip {
  id: string;
  title: string;
  coverPhoto?: string | null;
  startDate: string;
  endDate: string;
  isPublic: boolean;
  publicSlug?: string | null;
  stops: { cityName: string }[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/trips")
      .then((r) => r.json())
      .then((data) => setTrips(Array.isArray(data) ? data : []))
      .finally(() => setLoadingTrips(false));
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const user = session?.user;
  const upcoming = trips.filter((t) => new Date(t.startDate) > new Date());
  const past = trips.filter((t) => new Date(t.endDate) <= new Date());

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white pb-24">
      <DashboardNavbar />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm font-semibold text-orange-500 mb-1">Profile</p>
          <h1 className="text-4xl font-extrabold text-gray-900">Your Travel Profile</h1>
          <p className="text-gray-500 mt-2 max-w-xl">Track your journeys, manage your trips and control your public itineraries from one place.</p>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left: Profile Card */}
          <motion.div variants={cardVariants} initial="initial" animate="animate" transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 p-6 h-fit"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative w-24 h-24">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name ?? ""} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                    {user?.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white" title="Online" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name ?? "Traveler"}</h2>
                <p className="text-sm text-orange-500 font-medium">Explorer</p>
              </div>

              <div className="w-full rounded-2xl bg-orange-50/80 border border-orange-100 p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Map className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{trips.length} trip{trips.length !== 1 ? "s" : ""} planned</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full hover:opacity-90">
                  <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
                <Button variant="outline" className="w-full rounded-full" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
                <p className="text-xs text-gray-500">Total Trips</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-2xl">
                <p className="text-2xl font-bold text-gray-900">{trips.filter(t => t.isPublic).length}</p>
                <p className="text-xs text-gray-500">Shared</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Trips */}
          <div className="space-y-8">
            {/* Upcoming Trips */}
            <motion.div variants={cardVariants} initial="initial" animate="animate" transition={{ duration: 0.4, delay: 0.2 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Trips</h3>
              {loadingTrips ? (
                <div className="h-32 flex items-center justify-center">
                  <div className="w-7 h-7 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No upcoming trips. <Link href="/trips/new" className="text-orange-500 font-semibold hover:underline">Plan one now!</Link></p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {upcoming.slice(0, 3).map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Past Trips */}
            <motion.div variants={cardVariants} initial="initial" animate="animate" transition={{ duration: 0.4, delay: 0.3 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Past Trips</h3>
              {loadingTrips ? null : past.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No completed trips yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {past.slice(0, 6).map((trip) => (
                    <TripCard key={trip.id} trip={trip} isPast />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TripCard({ trip, isPast }: { trip: Trip; isPast?: boolean }) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-36 overflow-hidden bg-orange-100">
          {trip.coverPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={trip.coverPhoto} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isPast ? "bg-gray-100" : "bg-gradient-to-br from-orange-200 to-amber-200"}`}>
              <MapPin className={`w-8 h-8 ${isPast ? "text-gray-300" : "text-orange-300"}`} />
            </div>
          )}
          {trip.isPublic && (
            <div className="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Globe className="w-2.5 h-2.5" /> Public
            </div>
          )}
        </div>
        <div className="p-4">
          <h4 className="font-bold text-gray-900 text-sm leading-tight truncate mb-1">{trip.title}</h4>
          {trip.stops.length > 0 && (
            <p className="text-[11px] text-orange-500 font-medium truncate mb-1">
              📍 {trip.stops.map(s => s.cityName).join(" → ")}
            </p>
          )}
          <p className="text-[11px] text-gray-400">
            {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
