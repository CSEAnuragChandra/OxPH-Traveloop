"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, Circle, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChecklistItem {
  id: string;
  content: string;
  category: string | null;
  isPacked: boolean;
}

interface PackingChecklistProps {
  tripId: string;
  initialItems: ChecklistItem[];
}

const CATEGORIES = ["Documents", "Clothing", "Electronics", "Toiletries", "Health", "General"];

export default function PackingChecklist({ tripId, initialItems }: PackingChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [newItem, setNewItem] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const packedCount = items.filter((i) => i.isPacked).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    setLoading(true);
    const res = await fetch(`/api/trips/${tripId}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newItem, category }),
    });

    if (res.ok) {
      const item = await res.json();
      setItems([...items, item]);
      setNewItem("");
    }
    setLoading(false);
  };

  const toggleItem = async (item: ChecklistItem) => {
    const updated = { ...item, isPacked: !item.isPacked };
    
    // Optimistic UI update
    setItems(items.map((i) => (i.id === item.id ? updated : i)));

    await fetch(`/api/trips/${tripId}/checklist/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPacked: !item.isPacked }),
    });
  };

  const deleteItem = async (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    await fetch(`/api/trips/${tripId}/checklist/${id}`, { method: "DELETE" });
  };

  return (
    <div className="space-y-8">
      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Packing Progress</h3>
              <p className="text-sm text-gray-500">{packedCount} of {totalCount} items packed</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-orange-500">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Main Checklist */}
        <div className="space-y-6">
          {CATEGORIES.map((cat) => {
            const catItems = items.filter((i) => (i.category || "General") === cat);
            if (catItems.length === 0 && !adding) return null;

            return (
              <div key={cat} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                  <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{cat}</h4>
                </div>
                <div className="divide-y divide-gray-50">
                  <AnimatePresence initial={false}>
                    {catItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group"
                      >
                        <button 
                          onClick={() => toggleItem(item)}
                          className="flex items-center gap-3 text-left flex-1"
                        >
                          {item.isPacked ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                          )}
                          <span className={`text-sm font-medium transition-all ${
                            item.isPacked ? "text-gray-400 line-through" : "text-gray-700"
                          }`}>
                            {item.content}
                          </span>
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
          
          {items.length === 0 && !adding && (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Your checklist is empty</h3>
              <p className="text-sm text-gray-500 mb-6">Start adding items to get ready for your trip!</p>
              <Button onClick={() => setAdding(true)} className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                Add Your First Item
              </Button>
            </div>
          )}
        </div>

        {/* Add Item Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Add Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-1.5">
                <Label>What to pack?</Label>
                <Input 
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="e.g. Passport, Charger..."
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-xl py-6"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Add to List
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Suggested Items</h4>
              <div className="flex flex-wrap gap-2">
                {["Passport", "Camera", "Sunscreen", "Medication"].map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      setNewItem(item);
                      if (item === "Passport") setCategory("Documents");
                      else if (item === "Camera") setCategory("Electronics");
                      else setCategory("General");
                    }}
                    className="px-3 py-1 bg-gray-50 hover:bg-orange-50 border border-gray-100 rounded-full text-xs text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
