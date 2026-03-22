'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';

type MarketData = {
  date: string;
  AXS: number;
  SAND: number;
  MANA: number;
};

const COLORS = {
  AXS: '#3b82f6',  // blue-500
  SAND: '#f59e0b', // amber-500
  MANA: '#ec4899', // pink-500
};

export default function MacroEconomyChart() {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleTokens, setVisibleTokens] = useState({
    AXS: true,
    SAND: true,
    MANA: true
  });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const response = await fetch('/api/virtual-economies');
        if (!response.ok) throw new Error('Błąd API');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError('Brak dostępu do CoinGecko API. Spróbuj ponownie później.');
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const toggleToken = (token: keyof typeof visibleTokens) => {
    setVisibleTokens(prev => ({ ...prev, [token]: !prev[token] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[450px] w-full bg-slate-900/40 rounded-2xl border border-slate-800">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm tracking-wide">Pobieranie indeksów rynkowych z CoinGecko...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[450px] w-full bg-rose-950/20 rounded-2xl border border-rose-900/50 text-rose-400">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 w-full max-w-5xl mx-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-500" />
            Makroekonomia Web3 Gaming (30 dni)
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Prawdziwe dane rynkowe pobierane na żywo. Wykres przedstawia wahania kursów (USD) walut w wirtualnych gospodarkach (Axie Infinity, The Sandbox, Decentraland). 
          </p>
        </div>
        
        <div className="flex gap-2 bg-slate-900 p-1.5 rounded-lg border border-slate-800 h-fit">
          {Object.keys(COLORS).map((token) => (
            <button
              key={token}
              onClick={() => toggleToken(token as keyof typeof visibleTokens)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                visibleTokens[token as keyof typeof visibleTokens]
                  ? 'bg-slate-800 text-slate-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full mt-2 bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <defs>
              {Object.entries(COLORS).map(([key, color]) => (
                <linearGradient key={`color${key}`} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#1e293b' }}
              minTickGap={20}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#000000', 
                borderColor: '#1e293b',
                borderRadius: '8px',
                color: '#f8fafc',
                fontFamily: 'monospace'
              }}
              itemStyle={{ fontSize: '14px', fontWeight: 500 }}
              labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
            />
            
            {Object.entries(COLORS).map(([key, color]) => (
              visibleTokens[key as keyof typeof visibleTokens] && (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={color} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill={`url(#color${key})`} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
