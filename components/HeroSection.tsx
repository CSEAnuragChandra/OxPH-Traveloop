"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Calendar, ArrowRight, Play } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HeroStat = {
  value: string;
  label: string;
};

const defaultStats: HeroStat[] = [
  { value: "50K+", label: "Trips planned" },
  { value: "120+", label: "Countries covered" },
  { value: "4.9★", label: "Average rating" },
];

export default function HeroSection({ stats = defaultStats }: { stats?: HeroStat[] }) {
  const statsToRender = stats.length ? stats : defaultStats;

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=85"
          alt="Beautiful travel destination aerial view"
          fill
          priority
          className="object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 to-transparent" />
      </div>

      {/* Floating ambient elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center pt-32 pb-20 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Badge className="mb-6 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-200 border border-orange-400/30 text-sm font-medium backdrop-blur-sm">
            🌍 Your intelligent travel companion
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight max-w-4xl"
        >
          Plan trips that{" "}
          <span className="gradient-text">feel like magic</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-6 text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed"
        >
          Traveloop brings all your trip planning into one place. Build
          itineraries, track budgets, collaborate with friends, and discover
          activities — all powered by smart suggestions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-full px-8 py-6 text-base shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 group"
            )}
          >
            Start Planning for Free
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            className={cn(
              buttonVariants({ size: "lg", variant: "ghost" }),
              "text-white border border-white/30 hover:bg-white/10 rounded-full px-8 py-6 text-base backdrop-blur-sm group"
            )}
          >
            <Play className="mr-2 w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            Watch Demo
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-12 items-center"
        >
          {statsToRender.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-white/60 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85 }}
          className="mt-12 w-full max-w-3xl"
        >
          <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 flex-1 min-w-0">
              <MapPin className="w-5 h-5 text-orange-300 shrink-0" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="bg-transparent text-white placeholder:text-white/50 outline-none text-sm flex-1 min-w-0"
              />
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 flex-1 min-w-0">
              <Calendar className="w-5 h-5 text-orange-300 shrink-0" />
              <input
                type="text"
                placeholder="When are you travelling?"
                className="bg-transparent text-white placeholder:text-white/50 outline-none text-sm flex-1 min-w-0"
              />
            </div>
            <Link
              href="#destinations"
              className={cn(
                buttonVariants(),
                "bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl px-6 py-3 shrink-0 hover:from-orange-600 hover:to-amber-600 shadow-lg transition-all"
              )}
            >
              <Search className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline font-medium">Explore</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80 C360 20 1080 20 1440 80 L1440 80 L0 80 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
