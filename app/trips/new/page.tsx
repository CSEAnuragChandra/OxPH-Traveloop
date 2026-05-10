import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import CreateTripForm from "@/components/trips/CreateTripForm";

export const metadata: Metadata = {
  title: "Create New Trip — Traveloop",
  description: "Start planning your next adventure. Set your destination, dates, and budget.",
};

export default function NewTripPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30">
      <DashboardNavbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back link */}
        <Link
          href="/trips"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to My Trips
        </Link>

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-orange-500 tracking-wide uppercase mb-1">
            New Adventure
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Plan a Trip
          </h1>
          <p className="mt-3 text-gray-500 max-w-xl">
            Fill in the details below to create your trip. You&apos;ll be able to add destinations, activities,
            and a budget tracker once your trip is created.
          </p>
        </div>

        {/* Form */}
        <CreateTripForm />
      </div>
    </main>
  );
}
