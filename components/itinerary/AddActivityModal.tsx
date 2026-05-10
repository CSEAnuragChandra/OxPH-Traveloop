"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActivityItemData } from "./ActivityItem";

const ACTIVITY_TYPES = [
  "Sightseeing", "Food", "Adventure", "Accommodation",
  "Transport", "Shopping", "Culture", "Wellness", "Other",
];

interface AddActivityModalProps {
  open: boolean;
  onClose: () => void;
  stopId: string;
  tripId: string;
  editingActivity?: ActivityItemData | null;
  onSaved: (activity: ActivityItemData, isEdit: boolean) => void;
}

export default function AddActivityModal({
  open,
  onClose,
  stopId,
  tripId,
  editingActivity,
  onSaved,
}: AddActivityModalProps) {
  const isEdit = !!editingActivity;

  const [title, setTitle] = useState(editingActivity?.title ?? "");
  const [type, setType] = useState(editingActivity?.type ?? ACTIVITY_TYPES[0]);
  const [description, setDescription] = useState(editingActivity?.description ?? "");
  const [cost, setCost] = useState(editingActivity?.cost?.toString() ?? "");
  const [duration, setDuration] = useState(editingActivity?.duration?.toString() ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    setError(null);
    setLoading(true);

    const body = {
      title: title.trim(),
      type,
      description: description.trim() || undefined,
      cost: cost ? parseFloat(cost) : undefined,
      duration: duration ? parseInt(duration) : undefined,
    };

    const url = isEdit
      ? `/api/trips/${tripId}/stops/${stopId}/activities/${editingActivity!.id}`
      : `/api/trips/${tripId}/stops/${stopId}/activities`;

    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Failed to save activity");
      return;
    }
    const saved = await res.json();
    onSaved(saved, isEdit);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-gray-900">
                {isEdit ? "Edit Activity" : "Add Activity"}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="act-title">Activity Name</Label>
                <Input
                  id="act-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Visit Eiffel Tower"
                  autoFocus
                />
              </div>

              {/* Type */}
              <div className="space-y-1.5">
                <Label>Category</Label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        type === t
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="act-desc">Notes <span className="text-gray-400 font-normal">(optional)</span></Label>
                <Input
                  id="act-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any notes or details..."
                />
              </div>

              {/* Cost & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="act-cost">Cost (USD) <span className="text-gray-400 font-normal">(optional)</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <Input
                      id="act-cost"
                      type="number"
                      min={0}
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="50"
                      className="pl-7"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="act-duration">Duration (mins) <span className="text-gray-400 font-normal">(optional)</span></Label>
                  <Input
                    id="act-duration"
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="120"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {isEdit ? "Save Changes" : "Add Activity"}
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
