"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { format } from "date-fns";
import { Plus, Trash2, Pencil, Wallet, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Expense {
  id: string;
  category: string;
  amount: number;
  description?: string | null;
  date?: string | null;
}

interface BudgetDashboardProps {
  tripId: string;
  totalBudget?: number | null;
  initialExpenses: Expense[];
}

const CATEGORIES = ["Transport", "Stay", "Meals", "Activities", "Shopping", "Other"];
const COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7", "#64748b"];

export default function BudgetDashboard({ tripId, totalBudget, initialExpenses }: BudgetDashboardProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [adding, setAdding] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalBudget ? totalBudget - totalSpent : null;
  const progressPercent = totalBudget ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  // Chart Data
  const chartData = CATEGORIES.map((cat) => ({
    name: cat,
    value: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter((d) => d.value > 0);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const res = await fetch(`/api/trips/${tripId}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, amount, description }),
    });

    if (res.ok) {
      const newExpense = await res.json();
      setExpenses([newExpense, ...expenses]);
      setAdding(false);
      setAmount("");
      setDescription("");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/trips/${tripId}/expenses/${id}`, { method: "DELETE" });
    if (res.ok) {
      setExpenses(expenses.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
          <h3 className="text-3xl font-bold text-gray-900">${totalSpent.toLocaleString()}</h3>
        </div>
        
        {totalBudget && (
          <>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Budget</p>
              <h3 className="text-3xl font-bold text-gray-900">${totalBudget.toLocaleString()}</h3>
            </div>
            <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-center ${
              remaining !== null && remaining < 0 
                ? "bg-red-50 border-red-100" 
                : "bg-orange-50 border-orange-100"
            }`}>
              <p className={`text-sm font-medium mb-1 ${remaining !== null && remaining < 0 ? "text-red-500" : "text-orange-600"}`}>
                {remaining !== null && remaining < 0 ? "Over Budget" : "Remaining"}
              </p>
              <h3 className={`text-3xl font-bold ${remaining !== null && remaining < 0 ? "text-red-700" : "text-orange-700"}`}>
                ${Math.abs(remaining || 0).toLocaleString()}
              </h3>
            </div>
          </>
        )}
      </div>

      {/* Progress Bar */}
      {totalBudget && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-gray-500">Budget Usage</span>
            <span className={progressPercent > 100 ? "text-red-500" : "text-gray-900"}>
              {progressPercent.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent > 100 ? "bg-red-500" : progressPercent > 80 ? "bg-amber-400" : "bg-orange-500"
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Expenses List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-orange-500" />
              Expenses
            </h3>
            <Button onClick={() => setAdding(!adding)} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
              <Plus className="w-4 h-4 mr-1" /> Add Expense
            </Button>
          </div>

          {adding && (
            <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <Label>Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className="pl-7" required />
                  </div>
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label>Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Taxi to hotel" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAdding(false)}>Cancel</Button>
                <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800">Save Expense</Button>
              </div>
            </form>
          )}

          {expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-500 italic">No expenses logged yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Date</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 rounded-tr-lg"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {expense.date ? format(new Date(expense.date), "MMM d, yyyy") : "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {expense.description || "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">
                        ${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button onClick={() => handleDelete(expense.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Spending by Category</h3>
          {chartData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-gray-400 italic">
              Add expenses to see chart
            </div>
          ) : (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[CATEGORIES.indexOf(entry.name) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
