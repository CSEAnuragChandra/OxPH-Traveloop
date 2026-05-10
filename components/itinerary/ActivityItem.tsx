"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, Pencil, Trash2, Clock, DollarSign, Tag } from "lucide-react";
import { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";

export interface ActivityItemData {
  id: string;
  title: string;
  type: string;
  cost?: number | null;
  duration?: number | null;
  description?: string | null;
}

interface ActivityItemProps {
  activity: ActivityItemData;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
  onEdit: (activity: ActivityItemData) => void;
  onDelete: (activityId: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  Sightseeing: "bg-blue-100 text-blue-700",
  Food: "bg-amber-100 text-amber-700",
  Adventure: "bg-green-100 text-green-700",
  Accommodation: "bg-purple-100 text-purple-700",
  Transport: "bg-gray-100 text-gray-700",
  Shopping: "bg-pink-100 text-pink-700",
  Culture: "bg-indigo-100 text-indigo-700",
  Wellness: "bg-teal-100 text-teal-700",
};

export default function ActivityItem({
  activity,
  dragHandleProps,
  isDragging,
  onEdit,
  onDelete,
}: ActivityItemProps) {
  const typeClass = TYPE_COLORS[activity.type] ?? "bg-orange-100 text-orange-700";

  return (
    <motion.div
      layout
      animate={{ scale: isDragging ? 1.02 : 1, boxShadow: isDragging ? "0 12px 30px rgba(0,0,0,0.12)" : "none" }}
      className={`flex items-center gap-3 bg-white rounded-xl border px-3 py-3 group transition-colors ${
        isDragging ? "border-orange-300 bg-orange-50/50" : "border-gray-100 hover:border-gray-200"
      }`}
    >
      {/* Drag handle */}
      <div
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Type badge */}
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${typeClass}`}>
        {activity.type}
      </span>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{activity.title}</p>
        {activity.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{activity.description}</p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-400 shrink-0">
        {activity.duration != null && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {activity.duration >= 60
              ? `${Math.floor(activity.duration / 60)}h ${activity.duration % 60 ? `${activity.duration % 60}m` : ""}`
              : `${activity.duration}m`}
          </span>
        )}
        {activity.cost != null && (
          <span className="flex items-center gap-1 font-medium text-gray-600">
            <DollarSign className="w-3 h-3" />
            {activity.cost.toLocaleString()}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(activity)}
          className="p-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-gray-400 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(activity.id)}
          className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
