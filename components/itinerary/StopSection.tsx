"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, ChevronUp, MapPin, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Stop {
  id: string;
  cityName: string;
  country?: string | null;
  arrivalDate: string;
  departureDate: string;
  orderIndex: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  title: string;
  type: string;
  cost?: number | null;
  duration?: number | null;
  description?: string | null;
}

interface StopSectionProps {
  stop: Stop;
  index: number;
  tripId: string;
  onDelete: (stopId: string) => void;
  onUpdate: (stopId: string, data: Partial<Stop>) => void;
  onAddActivity: (stopId: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function StopSection({ stop, index, onDelete, onUpdate, onAddActivity }: StopSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [cityName, setCityName] = useState(stop.cityName);
  const [country, setCountry] = useState(stop.country || "");

  const handleSave = () => {
    onUpdate(stop.id, { cityName, country });
    setEditing(false);
  };

  const nights = Math.ceil(
    (new Date(stop.departureDate).getTime() - new Date(stop.arrivalDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-50">
        {/* Stop number badge */}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2">
              <Input
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="City name"
                className="h-8 text-sm"
                autoFocus
              />
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="h-8 text-sm w-32"
              />
              <Button size="sm" onClick={handleSave} className="h-8 bg-orange-500 hover:bg-orange-600 text-white px-3">
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="h-8 px-3">
                Cancel
              </Button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="text-left group">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {stop.cityName}
                  {stop.country && <span className="text-gray-400 font-normal">, {stop.country}</span>}
                </span>
                <span className="text-xs text-gray-400 ml-1">(click to edit)</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 ml-5">
                <Calendar className="w-3 h-3" />
                {formatDate(stop.arrivalDate)} → {formatDate(stop.departureDate)}
                <span className="text-orange-500 font-medium">{nights} night{nights !== 1 ? "s" : ""}</span>
              </div>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs text-gray-400 font-medium mr-2">
            {stop.activities.length} activit{stop.activities.length !== 1 ? "ies" : "y"}
          </span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(stop.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body — activities preview + add button */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {stop.activities.length === 0 ? (
                <p className="text-sm text-gray-400 italic text-center py-3">
                  No activities added yet.
                </p>
              ) : (
                stop.activities.map((act) => (
                  <div key={act.id} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium shrink-0">
                      {act.type}
                    </span>
                    <span className="flex-1 truncate font-medium">{act.title}</span>
                    {act.cost != null && (
                      <span className="text-gray-500 shrink-0">${act.cost}</span>
                    )}
                    {act.duration != null && (
                      <span className="text-gray-400 shrink-0 text-xs">{act.duration}m</span>
                    )}
                  </div>
                ))
              )}
              <button
                onClick={() => onAddActivity(stop.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 hover:border-orange-400 hover:bg-orange-50 rounded-xl text-sm text-gray-500 hover:text-orange-600 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Activity
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
