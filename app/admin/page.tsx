"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Users, Map, Globe, DollarSign, Zap,
  ShieldAlert, BarChart2, LogOut, TrendingUp,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

interface Stats {
  totalUsers: number;
  totalTrips: number;
  publicTrips: number;
  totalExpensesAmount: number;
  totalExpenseCount: number;
  totalActivities: number;
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: string | null;
  image?: string | null;
  _count: { trips: number };
}

const STAT_CARDS = (s: Stats) => [
  { label: "Total Users", value: s.totalUsers, icon: Users, color: "bg-blue-500", light: "bg-blue-50" },
  { label: "Total Trips", value: s.totalTrips, icon: Map, color: "bg-orange-500", light: "bg-orange-50" },
  { label: "Public Itineraries", value: s.publicTrips, icon: Globe, color: "bg-green-500", light: "bg-green-50" },
  { label: "Budget Tracked", value: `$${s.totalExpensesAmount.toLocaleString()}`, icon: DollarSign, color: "bg-purple-500", light: "bg-purple-50" },
  { label: "Total Activities", value: s.totalActivities, icon: Zap, color: "bg-amber-500", light: "bg-amber-50" },
];

const PIE_COLORS = ["#f97316", "#22c55e"];

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<{ stats: Stats; recentUsers: User[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/auth/signin"); return; }
    if (status !== "authenticated") return;

    fetch("/api/admin/stats")
      .then((r) => {
        if (r.status === 403) throw new Error("Access denied. Admin only.");
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 text-white">
        <ShieldAlert className="w-16 h-16 text-red-500" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-gray-400">{error}</p>
        <button onClick={() => router.push("/home")} className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-full text-sm font-semibold">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { stats, recentUsers } = data;

  const tripVisibilityData = [
    { name: "Private", value: stats.totalTrips - stats.publicTrips },
    { name: "Public", value: stats.publicTrips },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col hidden lg:flex">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white">Traveloop</p>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 font-semibold text-sm">
              <BarChart2 className="w-4 h-4" /> Overview
            </div>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors font-medium text-sm cursor-pointer">
              <Users className="w-4 h-4" /> Users
            </div>
          </nav>
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 p-3 rounded-xl mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                {session?.user?.name?.[0] ?? "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{session?.user?.name ?? "Admin"}</p>
                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-10 space-y-8">
            <div>
              <p className="text-sm font-semibold text-orange-400 uppercase tracking-widest mb-1">Analytics</p>
              <h1 className="text-3xl font-extrabold text-white">Platform Overview</h1>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {STAT_CARDS(stats).map((card) => (
                <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-4 bg-opacity-20`}>
                    <card.icon className={`w-5 h-5 text-white`} />
                  </div>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users per count bar chart */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" /> Trip Activity
                </h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Trips", value: stats.totalTrips, fill: "#f97316" },
                      { name: "Activities", value: stats.totalActivities, fill: "#eab308" },
                      { name: "Expenses", value: stats.totalExpenseCount, fill: "#a855f7" },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                      <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 12, color: "#f9fafb" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {[{ fill: "#f97316" }, { fill: "#eab308" }, { fill: "#a855f7" }].map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Public vs Private pie */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-green-400" /> Trip Visibility
                </h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={tripVisibilityData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                        {tripVisibilityData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#111827", border: "1px solid #374151", borderRadius: 12 }} />
                      <Legend iconType="circle" wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* User Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" /> Recent Users
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800/50">
                      <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">User</th>
                      <th className="text-left px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Email</th>
                      <th className="text-center px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Trips</th>
                      <th className="text-center px-6 py-3 text-gray-400 font-semibold text-xs uppercase tracking-wider">Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {recentUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                            {u.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span>{u.name?.[0] ?? "?"}</span>
                            )}
                          </div>
                          <span className="font-medium text-white">{u.name ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full text-xs font-bold">
                            {u._count.trips}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.emailVerified ? (
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold">✓ Yes</span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded-full text-xs font-bold">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
