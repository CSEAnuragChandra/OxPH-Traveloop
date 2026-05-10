"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Destinations", href: "#destinations" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Community", href: "#community" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-orange-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md group-hover:shadow-orange-300 transition-shadow">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-xl font-bold tracking-tight transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            Traveloop
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                scrolled ? "text-gray-600" : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/profile"
            className={`text-sm font-semibold transition-colors hover:text-orange-500 ${
              scrolled ? "text-gray-700" : "text-white"
            }`}
          >
            Profile
          </Link>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className={`text-sm font-medium transition-colors ${
              scrolled
                ? "text-gray-700 hover:text-orange-500"
                : "text-white hover:text-orange-300"
            }`}
          >
            Log in
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-orange-300 transition-all duration-200 rounded-full px-5">
            Sign up
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            scrolled ? "text-gray-700" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-lg border-b border-orange-100 px-6 pb-6"
        >
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 font-medium hover:text-orange-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="text-gray-900 font-semibold hover:text-orange-500 transition-colors"
            >
              Profile
            </Link>
            <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              <Button variant="outline" className="w-full">
                Log in
              </Button>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full">
                Get Started Free
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
