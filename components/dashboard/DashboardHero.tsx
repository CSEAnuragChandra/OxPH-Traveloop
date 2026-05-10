"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, Filter, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHero() {
  return (
    <section className="relative w-full h-[400px] md:h-[450px] overflow-hidden rounded-b-[2.5rem] mb-12">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80"
          alt="Scenic travel background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
      </div>

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Where to next, Alex?
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-light mb-8 max-w-xl">
            Manage your itineraries, explore new destinations, and organize your adventures.
          </p>

          {/* Search Bar & Filters */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-2xl flex flex-col md:flex-row gap-3 w-full max-w-5xl shadow-2xl">
            {/* Main Search Input */}
            <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 md:py-0 h-[50px] shadow-sm">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search destinations, cities, or activities..."
                className="w-full bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 h-[50px] transition-colors border border-white/10 text-sm font-medium">
                <Calendar className="w-4 h-4" />
                <span className="hidden md:inline">Dates</span>
              </button>
              
              <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white rounded-xl px-4 h-[50px] transition-colors border border-white/10 text-sm font-medium">
                <Users className="w-4 h-4" />
                <span className="hidden md:inline">Travelers</span>
              </button>

              <div className="w-px h-8 bg-white/20 my-auto mx-1 hidden md:block"></div>

              {/* Action Tools */}
              <button className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-xl w-[50px] h-[50px] transition-colors border border-white/10" aria-label="Filter">
                <Filter className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-xl w-[50px] h-[50px] transition-colors border border-white/10" aria-label="Sort">
                <SortDesc className="w-4 h-4" />
              </button>

              {/* Search Button */}
              <Button className="h-[50px] px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 md:ml-2">
                <Search className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline font-semibold">Search</span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
