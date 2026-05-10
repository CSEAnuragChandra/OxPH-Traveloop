"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Plus, Trash2, Calendar, MapPin, Search, Tag, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Note {
  id: string;
  content: string;
  date: string;
  stopId?: string | null;
  stop?: { cityName: string } | null;
}

interface NotesManagerProps {
  tripId: string;
  stops: { id: string; cityName: string }[];
  initialNotes: Note[];
}

export default function NotesManager({ tripId, stops, initialNotes }: NotesManagerProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [adding, setAdding] = useState(false);
  const [content, setContent] = useState("");
  const [stopId, setStopId] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStop, setFilterStop] = useState("all");

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.content.toLowerCase().includes(search.toLowerCase());
    const matchesStop = filterStop === "all" || n.stopId === filterStop;
    return matchesSearch && matchesStop;
  });

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/trips/${tripId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, stopId: stopId || null }),
    });

    if (res.ok) {
      const note = await res.json();
      setNotes([note, ...notes]);
      setContent("");
      setStopId("");
      setAdding(false);
    }
    setLoading(false);
  };

  const deleteNote = async (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    await fetch(`/api/trips/${tripId}/notes/${id}`, { method: "DELETE" });
  };

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search your notes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={filterStop}
              onChange={(e) => setFilterStop(e.target.value)}
              className="flex h-10 w-full md:w-[180px] items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="all">All Locations</option>
              {stops.map(s => <option key={s.id} value={s.id}>{s.cityName}</option>)}
            </select>
            <Button onClick={() => setAdding(!adding)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> New Note
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Notes Grid */}
        <div className="space-y-6">
          {adding && (
            <div className="bg-white p-6 rounded-2xl border-2 border-orange-200 shadow-lg animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-bold text-gray-900 mb-4">What's on your mind?</h3>
              <form onSubmit={handleAddNote} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Note Content</Label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Capture a memory, a thought, or a tip..."
                    className="w-full min-h-[150px] p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm leading-relaxed"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tag Location (Optional)</Label>
                  <select
                    value={stopId}
                    onChange={(e) => setStopId(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">No location</option>
                    {stops.map(s => <option key={s.id} value={s.id}>{s.cityName}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Discard</Button>
                  <Button type="submit" disabled={loading} className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-8">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Note"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {filteredNotes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notes found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or add a new journal entry.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotes.map((note) => (
                <div key={note.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(note.date), "MMM d, yyyy")}
                    </div>
                    <button 
                      onClick={() => deleteNote(note.id)}
                      className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                    {note.content}
                  </p>

                  {note.stop && (
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md w-fit">
                      <MapPin className="w-3 h-3" />
                      {note.stop.cityName}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-orange-500 to-amber-500 p-6 rounded-2xl text-white shadow-lg shadow-orange-200/50">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Memories Matter
            </h3>
            <p className="text-sm text-orange-50 leading-relaxed opacity-90">
              Your notes are automatically tagged with the current date. You can also link them to specific destinations to keep your memories organized by location.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4">Quick Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Total Entries</span>
                <span className="font-bold text-gray-900">{notes.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Geo-tagged</span>
                <span className="font-bold text-gray-900">{notes.filter(n => n.stopId).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
