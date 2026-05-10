"use client";

import { motion } from "framer-motion";
import { UserPlus, Map, Plane, Share2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create your account",
    description:
      "Sign up for free in seconds. No credit card required. Set up your traveller profile with your preferences and style.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    step: "02",
    icon: Map,
    title: "Build your itinerary",
    description:
      "Select destinations, set dates, and use our drag-and-drop builder to arrange your perfect day-by-day plan.",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    step: "03",
    icon: Plane,
    title: "Discover & add activities",
    description:
      "Browse thousands of activities, restaurants, hotels, and experiences. Add them to your days with one click.",
    gradient: "from-teal-500 to-emerald-400",
  },
  {
    step: "04",
    icon: Share2,
    title: "Share & collaborate",
    description:
      "Invite friends to collaborate, share a read-only link, or export your itinerary as a PDF to take offline.",
    gradient: "from-pink-500 to-rose-400",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">
            Super simple
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            From idea to adventure{" "}
            <span className="gradient-text">in 4 steps</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Planning a trip has never been this effortless. Get your dream
            itinerary ready in minutes, not hours.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-orange-200 via-violet-200 to-pink-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.15 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step number + icon bubble */}
                  <div className="relative mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg z-10 relative`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                      {step.step.slice(-1)}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
