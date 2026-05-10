"use client";

import { motion } from "framer-motion";
import {
  Map,
  Wallet,
  Users,
  Sparkles,
  Route,
  Bell,
  ShoppingBag,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Route,
    title: "Smart Itinerary Builder",
    description:
      "Drag-and-drop your day-wise plan across multiple cities. Add hotels, flights, restaurants, and activities in seconds.",
    gradient: "from-orange-500 to-amber-400",
    bg: "bg-orange-50",
  },
  {
    icon: Wallet,
    title: "Budget & Expense Tracking",
    description:
      "Set per-trip budgets, log expenses in categories, and get a real-time financial overview with visual breakdowns.",
    gradient: "from-teal-500 to-emerald-400",
    bg: "bg-teal-50",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Suggestions",
    description:
      "Get intelligent recommendations for places, activities, and restaurants based on your travel style and preferences.",
    gradient: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
  },
  {
    icon: Users,
    title: "Collaborative Planning",
    description:
      "Invite teammates and travel buddies to co-edit the itinerary in real time. Share, comment, and vote on activities.",
    gradient: "from-pink-500 to-rose-400",
    bg: "bg-pink-50",
  },
  {
    icon: ShoppingBag,
    title: "Packing Checklists",
    description:
      "Generate smart packing lists based on destination climate, duration, and activities planned in your itinerary.",
    gradient: "from-sky-500 to-blue-400",
    bg: "bg-sky-50",
  },
  {
    icon: Globe,
    title: "Destination Discovery",
    description:
      "Browse curated regions, top-rated attractions, local tips, and hidden gems across 120+ countries worldwide.",
    gradient: "from-amber-500 to-yellow-400",
    bg: "bg-amber-50",
  },
  {
    icon: Bell,
    title: "Trip Notes & Journal",
    description:
      "Capture memories, add reminders, and write daily journals so you never forget a moment of your journey.",
    gradient: "from-red-500 to-orange-400",
    bg: "bg-red-50",
  },
  {
    icon: Map,
    title: "Multi-City Support",
    description:
      "Plan seamless multi-city adventures with automatic routing, transit suggestions, and per-city sections.",
    gradient: "from-indigo-500 to-blue-400",
    bg: "bg-indigo-50",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Everything you need
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Travel planning,{" "}
            <span className="gradient-text">reimagined</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            From the moment you dream of a destination to the day you land back
            home, Traveloop is with you every step of the way.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 cursor-default"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div
                    className={`w-6 h-6 bg-gradient-to-br ${feature.gradient} rounded-md flex items-center justify-center`}
                  >
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-orange-500 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
