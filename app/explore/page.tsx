import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import ExploreGrid from "@/components/explore/ExploreGrid";
import { Compass } from "lucide-react";

export const metadata = {
  title: "Explore - Traveloop",
  description: "Discover activities, places, and experiences from around the world.",
};

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <DashboardNavbar />

      {/* Hero */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/80 font-semibold text-sm uppercase tracking-widest">Discover</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3 tracking-tight">
            Explore the World
          </h1>
          <p className="text-orange-50/90 text-lg max-w-xl">
            Find activities, landmarks, and hidden gems from across the globe. Add them directly to your upcoming trips.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ExploreGrid />
      </div>
    </main>
  );
}
