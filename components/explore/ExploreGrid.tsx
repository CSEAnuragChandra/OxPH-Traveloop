"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { Search, MapPin, Clock, DollarSign, X, Plus, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Activity {
  id: string;
  title: string;
  city: string;
  country: string;
  category: string;
  rating: number;
  imageUrl: string;
  description: string;
  duration: number;
  cost: number;
}

interface Trip {
  id: string;
  title: string;
}

const CATEGORIES = ["All", "Sightseeing", "Culture", "Food", "Adventure", "Shopping", "Wellness"];
const CATEGORY_ICONS: Record<string, string> = {
  All: "🌍", Sightseeing: "🏛️", Culture: "🎭", Food: "🍜", Adventure: "🧗", Shopping: "🛍️", Wellness: "🧘",
};

interface AddToTripModalProps {
  activity: Activity;
  onClose: () => void;
}

function AddToTripModal({ activity, onClose }: AddToTripModalProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [selectedStop, setSelectedStop] = useState("");
  const [stops, setStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/trips").then(r => r.json()).then(setTrips);
  }, []);

  useEffect(() => {
    if (!selectedTrip) return;
    fetch(`/api/trips/${selectedTrip}`).then(r => r.json()).then(data => setStops(data.stops || []));
  }, [selectedTrip]);

  const handleAdd = async () => {
    if (!selectedTrip || !selectedStop) return;
    setLoading(true);
    await fetch(`/api/trips/${selectedTrip}/stops/${selectedStop}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: activity.title,
        description: activity.description,
        type: activity.category,
        cost: activity.cost,
        duration: activity.duration,
      }),
    });
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Added!</h3>
            <p className="text-gray-500 text-sm mb-6">{activity.title} has been added to your itinerary.</p>
            <Button onClick={onClose} className="rounded-full px-8 bg-gray-900 text-white hover:bg-gray-800">Done</Button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add to Trip</h3>
                <p className="text-sm text-gray-500 mt-1 truncate max-w-[260px]">{activity.title}</p>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Trip</label>
                <select
                  value={selectedTrip}
                  onChange={(e) => { setSelectedTrip(e.target.value); setSelectedStop(""); }}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                >
                  <option value="">Choose a trip...</option>
                  {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>

              {stops.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Select Destination</label>
                  <select
                    value={selectedStop}
                    onChange={(e) => setSelectedStop(e.target.value)}
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  >
                    <option value="">Choose a destination...</option>
                    {stops.map((s: any) => <option key={s.id} value={s.id}>{s.cityName}</option>)}
                  </select>
                </div>
              )}

              <Button
                onClick={handleAdd}
                disabled={loading || !selectedTrip || !selectedStop}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-5 font-semibold mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add to Itinerary
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [debouncedQuery] = useDebounce(query, 400);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (category !== "All") params.set("category", category);
    const res = await fetch(`/api/explore?${params}`);
    const data = await res.json();
    setActivities(data);
    setLoading(false);
  }, [debouncedQuery, category]);

  useEffect(() => { fetchActivities(); }, [fetchActivities]);

  const handleAddToTrip = (activity: Activity) => {
    if (!session) { router.push("/auth/signin"); return; }
    setSelectedActivity(activity);
  };

  return (
    <div className="space-y-8">
      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search activities, cities, experiences..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 rounded-2xl text-base border-gray-200 focus:border-orange-400 focus:ring-orange-200"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span> {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-lg font-bold text-gray-900">No results found</h3>
          <p className="text-sm text-gray-500 mt-1">Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.imageUrl}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full text-gray-700">
                    {CATEGORY_ICONS[activity.category]} {activity.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full text-amber-600">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {activity.rating}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{activity.title}</h3>
                <p className="text-xs text-orange-500 font-semibold flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" /> {activity.city}, {activity.country}
                </p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{activity.duration}m</span>
                    {activity.cost > 0 && <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />₹{activity.cost}</span>}
                    {activity.cost === 0 && <span className="text-green-600 font-semibold">Free</span>}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToTrip(activity)}
                    className="rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs px-4"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedActivity && (
        <AddToTripModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      )}
    </div>
  );
}
