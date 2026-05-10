"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Wallet, ArrowRight, Clock, CheckCircle2 } from "lucide-react";

export type TripStatus = "ongoing" | "upcoming" | "completed";

export interface TripCardProps {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  coverPhoto?: string | null;
  totalBudget?: number | null;
  status: TripStatus;
  stops?: { cityName: string; country?: string | null }[];
  _count?: { stops: number; expenses: number };
}

const STATUS_STYLES: Record<TripStatus, { label: string; classes: string; icon: React.ReactNode }> = {
  ongoing: {
    label: "Ongoing",
    classes: "bg-green-100 text-green-700 border-green-200",
    icon: <Clock className="w-3 h-3" />,
  },
  upcoming: {
    label: "Upcoming",
    classes: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Calendar className="w-3 h-3" />,
  },
  completed: {
    label: "Completed",
    classes: "bg-gray-100 text-gray-600 border-gray-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
};

const FALLBACK_COVERS: Record<TripStatus, string> = {
  ongoing:
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80",
  upcoming:
    "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=900&q=80",
  completed:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDuration(start: string, end: string) {
  const days = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)
  );
  return `${days} day${days !== 1 ? "s" : ""}`;
}

export default function TripCard({
  id,
  title,
  description,
  startDate,
  endDate,
  coverPhoto,
  totalBudget,
  status,
  stops = [],
}: TripCardProps) {
  const statusConfig = STATUS_STYLES[status];
  const cover = coverPhoto || FALLBACK_COVERS[status];

  const destinationLabel =
    stops.length === 0
      ? "No destinations yet"
      : stops.length === 1
      ? `${stops[0].cityName}${stops[0].country ? `, ${stops[0].country}` : ""}`
      : `${stops[0].cityName} + ${stops.length - 1} more`;

  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm flex flex-col"
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {/* Status badge */}
        <span
          className={`absolute top-3 left-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${statusConfig.classes}`}
        >
          {statusConfig.icon}
          {statusConfig.label}
        </span>
        {/* Duration badge */}
        <span className="absolute bottom-3 right-3 text-xs text-white font-medium bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
          {getDuration(startDate, endDate)}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="truncate">{destinationLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              {formatDate(startDate)} – {formatDate(endDate)}
            </span>
          </div>
          {totalBudget != null && (
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Budget: ${totalBudget.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* View button */}
        <Link
          href={`/trips/${id}`}
          className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-sm shadow-orange-200 group/btn"
        >
          View Itinerary
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
