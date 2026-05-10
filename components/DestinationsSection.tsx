"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const destinations = [
  {
    name: "Santorini",
    country: "Greece",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    rating: 4.9,
    tag: "Trending",
    trips: "2.1K trips",
    tagColor: "bg-orange-500",
  },
  {
    name: "Kyoto",
    country: "Japan",
    image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=600&q=80",
    rating: 4.8,
    tag: "Cultural",
    trips: "1.8K trips",
    tagColor: "bg-violet-500",
  },
  {
    name: "Patagonia",
    country: "Argentina",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    rating: 4.9,
    tag: "Adventure",
    trips: "980 trips",
    tagColor: "bg-teal-500",
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&q=80",
    rating: 4.7,
    tag: "Scenic",
    trips: "1.4K trips",
    tagColor: "bg-pink-500",
  },
];

export default function DestinationsSection() {
  return (
    <section id="destinations" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="inline-block text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
              Top regional picks
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Where will you go{" "}
              <span className="gradient-text">next?</span>
            </h2>
          </div>
          <p className="text-gray-500 text-base md:max-w-xs leading-relaxed">
            Explore handpicked destinations loved by thousands of Traveloop
            community members.
          </p>
        </motion.div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={`${dest.name}, ${dest.country}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Tag */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`${dest.tagColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}
                  >
                    {dest.tag}
                  </span>
                </div>
                {/* Rating */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 glass rounded-full px-2.5 py-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-white text-xs font-semibold">
                    {dest.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-500 transition-colors">
                      {dest.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-500">{dest.country}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium mt-1">
                    {dest.trips}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
