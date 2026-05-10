"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import { MapPin, Calendar, GripVertical, Clock, DollarSign } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  type: string;
  cost?: number | null;
  duration?: number | null;
  description?: string | null;
  stopId: string;
}

interface Stop {
  id: string;
  cityName: string;
  country?: string | null;
  arrivalDate: string;
  departureDate: string;
  activities: Activity[];
}

interface DayTimelineProps {
  tripId: string;
  initialStops: Stop[];
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DayTimeline({ tripId, initialStops }: DayTimelineProps) {
  const [stops, setStops] = useState<Stop[]>(initialStops);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Find source and destination stops
    const sourceStopIndex = stops.findIndex((s) => s.id === source.droppableId);
    const destStopIndex = stops.findIndex((s) => s.id === destination.droppableId);

    if (sourceStopIndex === -1 || destStopIndex === -1) return;

    const sourceStop = stops[sourceStopIndex];
    const destStop = stops[destStopIndex];
    const newStops = [...stops];

    // Moving within the same stop (visual reorder only since we don't have orderIndex on Activity)
    if (source.droppableId === destination.droppableId) {
      const newActivities = Array.from(sourceStop.activities);
      const [moved] = newActivities.splice(source.index, 1);
      newActivities.splice(destination.index, 0, moved);

      newStops[sourceStopIndex] = { ...sourceStop, activities: newActivities };
      setStops(newStops);
      // Optional: Call API to persist internal order if added to schema
    } else {
      // Moving to a different stop
      const sourceActivities = Array.from(sourceStop.activities);
      const destActivities = Array.from(destStop.activities);
      const [moved] = sourceActivities.splice(source.index, 1);
      
      // Update the stopId of the moved activity
      const updatedActivity = { ...moved, stopId: destination.droppableId };
      destActivities.splice(destination.index, 0, updatedActivity);

      newStops[sourceStopIndex] = { ...sourceStop, activities: sourceActivities };
      newStops[destStopIndex] = { ...destStop, activities: destActivities };
      setStops(newStops);

      // Call API to update stopId
      await fetch(`/api/trips/${tripId}/activities/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: draggableId,
          newStopId: destination.droppableId,
        }),
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="relative border-l-2 border-orange-200 ml-4 md:ml-8 space-y-12 pb-12">
        {stops.map((stop, stopIndex) => (
          <div key={stop.id} className="relative pl-8 md:pl-12">
            {/* Timeline node */}
            <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white border-4 border-orange-500 shadow-sm" />
            
            {/* Stop Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-orange-500 uppercase tracking-wider">
                  Destination {stopIndex + 1}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(stop.arrivalDate)} — {formatDate(stop.departureDate)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-orange-500" />
                {stop.cityName}
                {stop.country && <span className="text-gray-400 font-normal">, {stop.country}</span>}
              </h3>
            </div>

            {/* Droppable Area for Activities */}
            <Droppable droppableId={stop.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`min-h-[100px] rounded-2xl p-4 transition-colors ${
                    snapshot.isDraggingOver ? "bg-orange-50/50 border border-orange-200 border-dashed" : "bg-gray-50 border border-transparent"
                  }`}
                >
                  {stop.activities.length === 0 && !snapshot.isDraggingOver && (
                    <div className="h-full flex items-center justify-center text-sm text-gray-400 italic">
                      No activities planned for this destination yet.
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {stop.activities.map((activity, index) => (
                      <Draggable key={activity.id} draggableId={activity.id} index={index}>
                        {(provided, snapshot) => {
                          const typeClass = TYPE_COLORS[activity.type] ?? "bg-orange-100 text-orange-700";
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-start gap-4 p-4 rounded-xl border bg-white transition-shadow ${
                                snapshot.isDragging ? "shadow-xl border-orange-300 rotate-1 z-50" : "shadow-sm border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="mt-1 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <div>
                                    <h4 className="font-semibold text-gray-900 leading-tight">
                                      {activity.title}
                                    </h4>
                                    {activity.description && (
                                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                        {activity.description}
                                      </p>
                                    )}
                                  </div>
                                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${typeClass}`}>
                                    {activity.type}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-3">
                                  {activity.duration != null && (
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                                      {activity.duration >= 60
                                        ? `${Math.floor(activity.duration / 60)}h ${activity.duration % 60 ? `${activity.duration % 60}m` : ""}`
                                        : `${activity.duration}m`}
                                    </div>
                                  )}
                                  {activity.cost != null && (
                                    <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                      <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                                      {activity.cost.toLocaleString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
