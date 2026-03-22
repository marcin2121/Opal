'use client';

import { useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis } from 'recharts';
import { DollarSign, Eye, EyeOff } from 'lucide-react';

interface PlayerData {
  id: number;
  playtime_hours: number;
  real_money_spent_usd: number;
  cluster_name: string;
}

const CLUSTERS = ['Free-to-Play Grinders', 'Casual Spenders', 'Whales'] as const;

const CLUSTER_COLORS: Record<string, string> = {
  'Free-to-Play Grinders': '#64748b', // slate-500
  'Casual Spenders': '#10b981',       // emerald-500
  'Whales': '#a855f7',                // purple-500
};

// Generowanie 50 mockowanych rekordów
const generateMockData = (): PlayerData[] => {
  return Array.from({ length: 50 }, (_, i) => {
    // Losowanie klastra
    const clusterIndex = Math.floor(Math.random() * 3);
    const cluster_name = CLUSTERS[clusterIndex];

    let playtime_hours = 0;
    let real_money_spent_usd = 0;

    if (cluster_name === 'Free-to-Play Grinders') {
      playtime_hours = Math.floor(Math.random() * 4000) + 1000; // 1000h - 5000h
      real_money_spent_usd = Math.floor(Math.random() * 10);    // 0$ - 10$
    } else if (cluster_name === 'Casual Spenders') {
      playtime_hours = Math.floor(Math.random() * 1000) + 100;  // 100h - 1100h
      real_money_spent_usd = Math.floor(Math.random() * 150) + 50; // 50$ - 200$
    } else if (cluster_name === 'Whales') {
      playtime_hours = Math.floor(Math.random() * 4000) + 200;  // 200h - 4200h
      real_money_spent_usd = Math.floor(Math.random() * 4000) + 1000; // 1000$ - 5000$
    }

    return {
      id: i + 1,
      playtime_hours,
      real_money_spent_usd,
      cluster_name
    };
  });
};

const mockData = generateMockData();

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
            <span className="text-slate-500">Wydatki:</span>
            <span className="text-slate-200">${data.real_money_spent_usd.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Czas gry:</span>
            <span className="text-slate-200">{data.playtime_hours}h</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function MonetizationChart() {
  const [data] = useState<PlayerData[]>(mockData);
  const [visibleClusters, setVisibleClusters] = useState<Record<string, boolean>>({
    'Free-to-Play Grinders': true,
    'Casual Spenders': true,
    'Whales': true
  });

  const toggleCluster = (cluster: string) => {
    setVisibleClusters(prev => ({ ...prev, [cluster]: !prev[cluster] }));
  };

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
            Mikroekonomia: Segmentacja Graczy
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Gracze podzieleni na klastry (K-Means) na podstawie ich realnych wydatków (USD) oraz czasu spędzonego w grze (Godziny).
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
                <span className="truncate max-w-[100px]">{cluster.split(' ')[0]}</span>
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
              dataKey="playtime_hours" 
              name="Czas gry" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              label={{ value: 'Czas gry (Godziny)', position: 'bottom', offset: 10, fill: '#64748b', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey="real_money_spent_usd" 
              name="Wydatki" 
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
              label={{ value: 'Wydatki (USD)', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 12 }}
            />
            <ZAxis type="number" range={[40, 40]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1', opacity: 0.1 }} />
            <Legend 
              verticalAlign="top" 
              height={1} 
              content={() => null} // Ukrywamy domyślną legendę, robimy własną na górze
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
