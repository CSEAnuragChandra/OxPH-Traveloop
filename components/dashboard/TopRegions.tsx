"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";

type RegionCard = {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  tripsPlanned: string;
};

export default function TopRegions({ regions = [] }: { regions?: RegionCard[] }) {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Top Regional Selections
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Curated destinations loved by the Traveloop community.
          </p>
        </div>
        <Link
          href="/explore"
          className="hidden md:flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors"
        >
          Explore all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {regions.map((region, index) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Background Image */}
            <img
              src={region.image}
              alt={region.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {region.name}
                  </h3>
                  <p className="text-sm text-gray-300">{region.country}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-white">
                      {region.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {!regions.length && (
          <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500">
            We will highlight top regions as you add more trips.
          </div>
        )}
      </div>
      
      <div className="mt-6 md:hidden">
        <Link
          href="/explore"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-colors"
        >
          Explore all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
