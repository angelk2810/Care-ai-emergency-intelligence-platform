import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Activity, ShieldAlert, Clock, Users } from 'lucide-react';
import { AppStats } from '../types';

export const DashboardPage = () => {
  const [stats, setStats] = useState<AppStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-12 text-center">Loading analytics...</div>;

  const pieData = [
    { name: 'Critical', value: stats.urgencyDistribution.Critical, color: '#ef4444' },
    { name: 'Urgent', value: stats.urgencyDistribution.Urgent, color: '#f59e0b' },
    { name: 'Non-Urgent', value: stats.urgencyDistribution["Non-Urgent"], color: '#10b981' },
  ];

  const barData = [
    { name: 'Mon', count: 4 },
    { name: 'Tue', count: 7 },
    { name: 'Wed', count: 5 },
    { name: 'Thu', count: 8 },
    { name: 'Fri', count: 12 },
    { name: 'Sat', count: 9 },
    { name: 'Sun', count: 6 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="mt-2 text-slate-500">Real-time insights into triage patterns and system performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {[
          { label: 'Total Assessments', value: stats.total, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Emergency Rate', value: `${((stats.urgencyDistribution.Critical / stats.total) * 100 || 0).toFixed(1)}%`, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Avg Confidence', value: `${stats.avgConfidence.toFixed(1)}%`, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Response Time', value: '1.2s', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className={cn("mb-4 inline-flex rounded-2xl p-3", stat.bg)}>
              <stat.icon className={cn("h-6 w-6", stat.color)} />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
            <div className="mt-1 text-3xl font-black text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="mb-8 text-lg font-bold text-slate-900">Risk Category Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-bold text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="mb-8 text-lg font-bold text-slate-900">Weekly Assessment Volume</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
