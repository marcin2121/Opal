'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from 'recharts';
import { Loader2, TrendingUp, ShieldAlert, Award } from 'lucide-react';

interface PlayerData {
  match_id: number;
  gold_per_min: number;
  hero_damage: number;
  cluster_name: string;
}

const CLUSTER_COLORS: Record<string, string> = {
  'Hard Supports': '#10b981', // Emerald
  'Space Creators': '#f59e0b', // Amber
  'Hard Carries': '#ec4a94', // Pink
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-4 shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-400">Match ID: {data.match_id}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm font-bold" style={{ color: CLUSTER_COLORS[data.cluster_name] || '#94a3b8' }}>
            {data.cluster_name}
          </p>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-slate-500">GPM:</span>
            <span className="font-mono text-slate-200">{data.gold_per_min}</span>
          </div>
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-slate-500">Damage:</span>
            <span className="font-mono text-slate-200">{data.hero_damage.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function DotaDashboard() {
  const [data, setData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dota-clusters');
        if (!response.ok) throw new Error('Failed to fetch cluster data');
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error loading data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-xl border border-red-500/20 bg-red-950/10 p-6 text-red-500">
        <ShieldAlert className="mr-2 h-6 w-6" />
        <p>{error}</p>
      </div>
    );
  }

  // Group data by cluster_name
  const groupedData = data.reduce((acc: Record<string, PlayerData[]>, item) => {
    const cluster = item.cluster_name || 'Unknown';
    if (!acc[cluster]) acc[cluster] = [];
    acc[cluster].push(item);
    return acc;
  }, {});

  return (
    <div className="w-full space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(CLUSTER_COLORS).map(([name, color]) => {
          const count = groupedData[name]?.length || 0;
          const avgGpm = count > 0 ? Math.floor(groupedData[name].reduce((sum, item) => sum + item.gold_per_min, 0) / count) : 0;
          
          return (
            <div key={name} className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-900/40 p-6 backdrop-blur-xl transition hover:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">{name}</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-100">{count} <span className="text-xs font-normal text-slate-500">players</span></h3>
                </div>
                <div className="rounded-lg p-2" style={{ backgroundColor: `${color}15`, color }}>
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <p className="text-xs text-slate-500">Avg. GPM</p>
                <div className="h-1 flex-1 rounded-full bg-slate-800">
                  <div className="h-full rounded-full" style={{ width: `${Math.min((avgGpm / 1000) * 100, 100)}%`, backgroundColor: color }} />
                </div>
                <span className="font-mono text-xs font-medium text-slate-300">{avgGpm}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-xl">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-100">Cluster Distribution</h3>
          <p className="text-xs text-slate-500">Correlation between economy and combat effectiveness</p>
        </div>
        
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 30, bottom: 50, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="gold_per_min" 
                name="Gold Per Minute" 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={{ stroke: '#475569' }}
                axisLine={{ stroke: '#475569' }}
                label={{ value: 'Gold Per Minute (GPM)', position: 'bottom', offset: 30, fill: '#64748b', fontSize: 14 }}
              />
              <YAxis 
                type="number" 
                dataKey="hero_damage" 
                name="Hero Damage" 
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickLine={{ stroke: '#475569' }}
                axisLine={{ stroke: '#475569' }}
                label={{ value: 'Hero Damage', angle: -90, position: 'left', offset: 40, fill: '#64748b', fontSize: 14 }}
              />
              <ZAxis type="number" range={[20, 20]} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1', opacity: 0.2 }} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
              />
              {Object.entries(groupedData).map(([name, points]) => (
                <Scatter 
                  key={name}
                  name={name} 
                  data={points} 
                  fill={CLUSTER_COLORS[name] || '#ffffff'} 
                  opacity={0.8}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
