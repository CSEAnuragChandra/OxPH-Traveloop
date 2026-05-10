"use client";

import { MapPin, MessageCircle, Camera, Briefcase, Code2 } from "lucide-react";

const links = {
  Product: ["Features", "Destinations", "How it works", "Pricing"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Help Center", "Community", "Privacy Policy", "Terms of Service"],
};

const socials = [
  { icon: MessageCircle, label: "Twitter" },
  { icon: Camera, label: "Instagram" },
  { icon: Briefcase, label: "LinkedIn" },
  { icon: Code2, label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Traveloop</span>
            </a>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your all-in-one intelligent travel planning companion. Build
              itineraries, track budgets, and share adventures effortlessly.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-orange-500 flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4 text-gray-400 hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white font-semibold text-sm mb-4">{group}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm hover:text-orange-400 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Traveloop. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Made with ❤️ for travellers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
