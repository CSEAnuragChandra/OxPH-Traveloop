import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardHero from "@/components/dashboard/DashboardHero";
import TopRegions from "@/components/dashboard/TopRegions";
import MyTrips from "@/components/dashboard/MyTrips";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Dashboard - Traveloop",
  description: "Manage your travel itineraries and explore destinations.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNavbar />
      
      {/* Main Content Area */}
      <main className="flex-1">
        <DashboardHero />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <MyTrips />
          <TopRegions />
        </div>
      </main>

      <Footer />
    </div>
  );
}
