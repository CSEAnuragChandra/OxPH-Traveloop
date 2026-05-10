"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Solo Traveller",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    rating: 5,
    text: "Traveloop turned my chaotic European trip into a masterpiece. The itinerary builder is so intuitive — I planned 8 cities in an afternoon!",
  },
  {
    name: "Marco Di Luca",
    role: "Adventure Photographer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    text: "The budget tracker saved my trip. I could see exactly where my money was going in real time. Absolute game changer for long-term travel.",
  },
  {
    name: "Ananya Verma",
    role: "Travel Blogger",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    rating: 5,
    text: "Collaborating with my travel group used to be a nightmare across spreadsheets. Traveloop made it effortless — everyone's on the same page.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Travellers love us
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Real stories,{" "}
            <span className="gradient-text">real adventures</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-orange-200 mb-4" />
              <p className="text-gray-700 leading-relaxed text-sm mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-orange-100">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
