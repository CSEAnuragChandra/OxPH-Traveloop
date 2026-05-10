"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CtaSection() {
  return (
    <section className="py-24 bg-white" id="cta">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-12 md:p-16 text-center shadow-2xl shadow-orange-300/40"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/2 translate-y-1/2 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Your next great adventure
              <br />
              starts here
            </h2>

            <p className="text-white/80 text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Join over 50,000 travellers who plan smarter, travel better, and
              make every trip unforgettable with Traveloop.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-orange-600 hover:bg-orange-50 font-bold rounded-full px-8 py-6 text-base shadow-xl hover:shadow-orange-200 transition-all duration-300 group"
                )}
              >
                Start planning for free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-white/70 text-sm">
                No credit card required · Free forever plan
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
