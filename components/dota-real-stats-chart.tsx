'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from 'recharts';
import { DollarSign, Eye, EyeOff, Loader2 } from 'lucide-react';

interface PlayerData {
  id: string;
  match_id: number;
  gold_per_min: number;
  hero_damage: number;
  cluster_name: string;
}

const CLUSTERS = ['Hard Supports', 'Space Creators', 'Hard Carries'] as const;

const CLUSTER_COLORS: Record<string, string> = {
  'Hard Supports': '#64748b',   // slate-500
  'Space Creators': '#10b981',  // emerald-500
  'Hard Carries': '#a855f7',    // purple-500
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-800 bg-black/90 p-4 shadow-xl backdrop-blur-md">
        <p className="text-sm font-bold" style={{ color: CLUSTER_COLORS[data.cluster_name] }}>
          {data.cluster_name}
        </p>
        <div className="mt-2 space-y-1 font-mono text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Mecz ID:</span>
            <span className="text-slate-200">{data.match_id}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">GPM:</span>
            <span className="text-slate-200">{data.gold_per_min}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Damage:</span>
            <span className="text-slate-200">{data.hero_damage.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function DotaRealStatsChart() {
  const [data, setData] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleClusters, setVisibleClusters] = useState<Record<string, boolean>>({
    'Hard Supports': true,
    'Space Creators': true,
    'Hard Carries': true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dota-real-stats');
        if (!response.ok) throw new Error('Błąd pobierania danych z OpenDota API');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError('Brak dostępu do OpenDota API. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCluster = (cluster: string) => {
    setVisibleClusters(prev => ({ ...prev, [cluster]: !prev[cluster] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] w-full bg-slate-900/40 rounded-2xl border border-slate-800">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm tracking-wide">Pobieranie indeksów meczów z OpenDota...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[350px] w-full bg-rose-950/20 rounded-2xl border border-rose-900/50 text-rose-400">
        {error}
      </div>
    );
  }

  // Grupowanie danych
  const groupedData = data.reduce((acc: Record<string, PlayerData[]>, item) => {
    const cluster = item.cluster_name;
    if (!acc[cluster]) acc[cluster] = [];
    acc[cluster].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-5xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-500" />
            Mikroekonomia: Wydajność Graczy (Pro Matches)
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Prawdziwe statystyki graczy z 5 ostatnich meczów pro-rankingowych pobierane z OpenDota. Korelacja GPM i Obrażeń.
          </p>
        </div>
        
        <div className="flex gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800 h-fit">
          {CLUSTERS.map((cluster) => {
            const isVisible = visibleClusters[cluster];
            return (
              <button
                key={cluster}
                onClick={() => toggleCluster(cluster)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  isVisible
                    ? 'bg-slate-800 text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CLUSTER_COLORS[cluster] }} />
                <span className="truncate max-w-[100px]">{cluster.split(' ')[1] || cluster}</span>
                {isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[350px] w-full mt-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
            <XAxis 
              type="number" 
              dataKey="gold_per_min" 
              name="GPM" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              label={{ value: 'Gold Per Minute (GPM)', position: 'bottom', offset: 10, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="hero_damage" 
              name="Obrażenia" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Obrażenia (Damage)', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 12 }}
            />
            <ZAxis type="number" range={[40, 40]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1', opacity: 0.1 }} />
            <Legend 
              verticalAlign="top" 
              height={1} 
              content={() => null} 
            />
            
            {CLUSTERS.map((cluster) => (
              visibleClusters[cluster] && (
                <Scatter 
                  key={cluster}
                  name={cluster} 
                  data={groupedData[cluster] || []} 
                  fill={CLUSTER_COLORS[cluster]} 
                  opacity={0.8}
                />
              )
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
