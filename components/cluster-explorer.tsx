'use client';

import { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Loader2, Settings, Users, Percent, DollarSign, BarChart2, Activity } from 'lucide-react';

const CLUSTER_COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6'];

interface Point {
  id: string;
  hourlyRate: number;
  earnings: number;
  successRate: number;
  clientRating: number;
  marketingSpend: number;
  rehireRate: number;
  jobsCompleted: number;
  cluster: number;
  category: string;
  platform: string;
  region: string;
}

const AVAILABLE_FEATURES = [
  { value: 'hourlyRate', label: 'Stawka $/h' },
  { value: 'earnings', label: 'Zarobki ($)' },
  { value: 'successRate', label: 'Skuteczność %' },
  { value: 'clientRating', label: 'Rating Klienta' },
  { value: 'marketingSpend', label: 'Wydatki Marketing' },
  { value: 'rehireRate', label: 'Rehire %' },
  { value: 'jobsCompleted', label: 'Zlecenia ukończone' }
];

const PRESETS = [
  {
    title: "💰 Zwrot z Reklamy (ROI)",
    desc: "Korelacja wydatków na marketing do zarobków. Czy opłaca się inwestować w reklamę?",
    x: "marketingSpend",
    y: "earnings"
  },
  {
    title: "📈 Elastyczność Cenowa",
    desc: "Stawka $/h vs Skuteczność %. Czy wysoka cena idzie w parze z zadowoleniem?",
    x: "hourlyRate",
    y: "successRate"
  },
  {
    title: "⭐ Reputacja a Wynik",
    desc: "Rating Klienta vs Zarobki. Czy oceny są kluczem do wejścia w klaster 'Whales'?",
    x: "clientRating",
    y: "earnings"
  },
  {
    title: "🤝 Lojalność Klienta",
    desc: "Rehire % vs Zarobki. Czy powracający klienci to fundament najwyższych dochodów?",
    x: "rehireRate",
    y: "earnings"
  },
  {
    title: "⏳ Model Pracy (Workload)",
    desc: "Zlecenia ukończone vs Stawka $/h. Model 'High-Volume' vs 'High-Ticket'.",
    x: "jobsCompleted",
    y: "hourlyRate"
  },
  {
    title: "📉 Zmęczenie Skalą",
    desc: "Liczba zleceń vs Skuteczność %. Czy masowa realizacja obniża jakość usług?",
    x: "jobsCompleted",
    y: "successRate"
  }
];
export default function ClusterExplorer() {


  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtry / Parametry K-Means
  const [k, setK] = useState(4);
  const [xAxisFeature, setXAxisFeature] = useState('hourlyRate');
  const [yAxisFeature, setYAxisFeature] = useState('earnings');
  const [highlightedCluster, setHighlightedCluster] = useState<number | null>(null);

  const [filters, setFilters] = useState<Record<string, string[]>>({

    platform: [],
    category: [],
    region: []
  });

  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    fetch('/api/dataset')
      .then(res => res.json())
      .then(json => setMetadata(json.metadata))
      .catch(console.error);

    trainClusters();
  }, []);

  const trainClusters = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dla K-Means wysyłamy wszystkie główne cechy do wielowymiarowego klasterowania
      const featuresToSend = AVAILABLE_FEATURES.map(f => f.value);
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ k, features: featuresToSend, filters })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Błąd K-Means');
      }

      const json = await response.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Error executing K-Means');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterToggle = (key: string, value: string) => {
    setFilters(prev => {
      const selected = prev[key] || [];
      const updated = selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value];
      return { ...prev, [key]: updated };
    });
  };

  const groupedData = data?.points.reduce((acc: Record<number, Point[]>, p:Point) => {
    if (!acc[p.cluster]) acc[p.cluster] = [];
    acc[p.cluster].push(p);
    return acc;
  }, {}) || {};

  // GENERATOR WNIOSKÓW (Automatyczna interpretacja)
  const getDynamicConclusion = () => {
    if (!data?.clusterProfiles || data.clusterProfiles.length === 0) return null;

    const profiles = data.clusterProfiles;
    const xKey = `avg${xAxisFeature.charAt(0).toUpperCase() + xAxisFeature.slice(1)}`;
    const yKey = `avg${yAxisFeature.charAt(0).toUpperCase() + yAxisFeature.slice(1)}`;

    // Znajdź klaster z najwyższym X
    const topXProfile = [...profiles].sort((a, b) => (b[xKey] || 0) - (a[xKey] || 0))[0];
    const topYProfile = [...profiles].sort((a, b) => (b[yKey] || 0) - (a[yKey] || 0))[0];

    const xLabel = AVAILABLE_FEATURES.find(f => f.value === xAxisFeature)?.label;
    const yLabel = AVAILABLE_FEATURES.find(f => f.value === yAxisFeature)?.label;

    return (
      <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl flex flex-col gap-1.5 backdrop-blur-md">
        <h4 className="text-xs font-bold text-indigo-400 tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5" /> AUTOMATYCZNA ANALIZA WZORCÓW
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed">
          Z analizy statystycznej wynika, że <span className="text-emerald-400 font-semibold font-mono">Klaster {topXProfile.cluster + 1}</span> osiąga najwyższy wynik dla <span className="underline underline-offset-2">{xLabel}</span>. 
          Jednocześnie najwyższe <span className="underline underline-offset-2">{yLabel}</span> odnotowano w grupie <span className="text-amber-400 font-semibold font-mono">Klaster {topYProfile.cluster + 1}</span>.
        </p>
        <p className="text-xs text-slate-400">
          Wskazuje to na to, że grupa o najwyższej sile parametru <span className="text-slate-200">{xLabel}</span> osiąga profilowo {topXProfile[yKey] >= topYProfile[yKey] ? "najwyższy" : "inny"} poziom parametru <span className="text-slate-200">{yLabel}</span>, co pozwala wyskalować zależność klastrową.
        </p>
      </div>
    );
  };

  // Obliczenie wartości do Radaru

  const getRadarData = () => {
    if (!data?.clusterProfiles) return [];

    // Normalizacja do słupków radaru (uproszczona)
    const attributes = [
      { key: 'avgEarnings', label: 'Zarobki', scale: (v: number) => v / 1000 },
      { key: 'avgHourlyRate', label: 'Stawka', scale: (v: number) => v },
      { key: 'avgSuccessRate', label: 'Success %', scale: (v: number) => v },
      { key: 'avgClientRating', label: 'Rating', scale: (v: number) => v * 10 },
      { key: 'avgMarketingSpend', label: 'Marketing', scale: (v: number) => v / 10 }
    ];

    return attributes.map(attr => {
      const row: any = { subject: attr.label };
      data.clusterProfiles.forEach((p: any) => {
        row[`C${p.cluster+1}`] = attr.scale(p[attr.key] || 0);
      });
      return row;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full text-slate-100 p-2">
      {/* 1. Lewy panel - Parametry */}
      <div className="w-full lg:w-1/4 flex flex-col gap-6 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" /> Parametry K-Means
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-indigo-400 mb-2">Gotowe Scenariusze Badawcze</label>
            <div className="flex flex-col gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.x + preset.y}
                  onClick={() => {
                    setXAxisFeature(preset.x);
                    setYAxisFeature(preset.y);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    xAxisFeature === preset.x && yAxisFeature === preset.y
                      ? 'bg-indigo-950/80 border-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-100">{preset.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800/80 my-3"></div>

          <div>
            <label className="block text-sm text-slate-400">Liczba Klastrów (k)</label>

            <input 
              type="range" min="2" max="6" value={k} 
              onChange={(e) => setK(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-1"
            />
            <span className="text-xs text-indigo-400 font-bold">{k} klastrów</span>
          </div>

          <div>
            <label className="block text-sm text-slate-400">Oś X Wykresu</label>
            <select value={xAxisFeature} onChange={(e) => setXAxisFeature(e.target.value)} className="w-full bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg mt-1 text-xs">
              {AVAILABLE_FEATURES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400">Oś Y Wykresu</label>
            <select value={yAxisFeature} onChange={(e) => setYAxisFeature(e.target.value)} className="w-full bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg mt-1 text-xs">
              {AVAILABLE_FEATURES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2 font-semibold">Platforma</label>
            <div className="flex flex-wrap gap-1.5">
              {metadata?.platforms.map((p: string) => (
                <button key={p} onClick={() => handleFilterToggle('platform', p)}
                  className={`px-2 py-0.5 text-[11px] rounded border transition-all cursor-pointer ${
                    filters.platform.includes(p) ? 'bg-indigo-600 border-indigo-400' : 'border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700'
                  }`}>{p}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2 font-semibold">Kategoria (Top 4)</label>
            <div className="flex flex-wrap gap-1.5">
              {metadata?.categories.slice(0, 4).map((c: string) => (
                <button key={c} onClick={() => handleFilterToggle('category', c)}
                  className={`px-2 py-0.5 text-[11px] rounded border transition-all cursor-pointer ${
                    filters.category.includes(c) ? 'bg-indigo-600 border-indigo-400' : 'border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700'
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2 font-semibold">Region (Top 3)</label>
            <div className="flex flex-wrap gap-1.5">
              {metadata?.regions.slice(0, 3).map((r: string) => (
                <button key={r} onClick={() => handleFilterToggle('region', r)}
                  className={`px-2 py-0.5 text-[11px] rounded border transition-all cursor-pointer ${
                    filters.region.includes(r) ? 'bg-indigo-600 border-indigo-400' : 'border-slate-800 bg-slate-900/60 text-slate-500 hover:border-slate-700'
                  }`}>{r}</button>
              ))}
            </div>
          </div>


          <button onClick={trainClusters} className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl cursor-pointer">
            Retrain Clusters
          </button>
        </div>
      </div>

      {/* 2. Centrum - Wykresy */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* AUTOMATYCZNY WNIOSEK */}
        {!loading && data && getDynamicConclusion()}

        {/* Główny Scatter Plot */}
        <div className="relative flex items-center justify-center bg-slate-950/70 p-5 rounded-2xl border border-slate-800/50 shadow-2xl h-[450px]">

          {loading && (
            <div className="absolute inset-0 z-20 bg-black/30 flex items-center justify-center backdrop-blur-sm rounded-2xl">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
          )}
          {!loading && !error && data && (
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
                <XAxis type="number" dataKey={xAxisFeature} name={xAxisFeature} stroke="#64748b" fontSize={11}
                  label={{ value: AVAILABLE_FEATURES.find(f => f.value === xAxisFeature)?.label, position: 'bottom', offset: 5, fill: '#64748b' }} />
                <YAxis type="number" dataKey={yAxisFeature} name={yAxisFeature} stroke="#64748b" fontSize={11}
                  label={{ value: AVAILABLE_FEATURES.find(f => f.value === yAxisFeature)?.label, angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1', opacity: 0.1 }} />
                {data.clusterProfiles.map((profile: any) => (
                  <Scatter key={profile.cluster} name={`Klaster ${profile.cluster + 1}`} 
                    data={groupedData[profile.cluster] || []} 
                    fill={CLUSTER_COLORS[profile.cluster % CLUSTER_COLORS.length]} 
                    opacity={highlightedCluster !== null && profile.cluster !== highlightedCluster ? 0.05 : 0.7} 
                  />
                ))}

              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Diagnostyka i Podsumowanie (Dwukolumnowy dolny grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* A. Metoda Łokcia (LineChart) */}
          <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50 flex flex-col">
            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
              <BarChart2 className="w-4 h-4 text-amber-400" /> Metoda Łokcia (Diagnostyka SSE)
            </h4>
            <span className="text-xs text-slate-500 mb-4">Wskaźnik zagięcia krzywej błędu pomaga dobrać optymalne K.</span>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.elbowData || []} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                  <XAxis dataKey="k" stroke="#64748b" fontSize={11} label={{ value: 'K', position: 'insideBottomRight', fill: '#64748b' }} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip labelStyle={{ color: '#fff' }} />
                  <Line type="monotone" dataKey="sse" name="Błąd (SSE)" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* B. Wykres Radarowy (Profilowanie klastrów) */}
          <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50 flex flex-col">
            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-indigo-400" /> Wycena Radarowa Klastrów
            </h4>
            <div className="h-[200px] w-full flex items-center justify-center">
              {data && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" data={getRadarData()}>
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} stroke="#1e293b" fontSize={9} />
                    {data.clusterProfiles.map((p: any) => (
                      <Radar key={p.cluster} name={`C${p.cluster+1}`} dataKey={`C${p.cluster+1}`} 
                        stroke={CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]} fill={CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]} fillOpacity={0.05} />
                    ))}
                    <Legend iconType="circle" fontSize={10} color="#fff" />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Statystyki Klastrów (Małe karty) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.clusterProfiles.map((p: any, i: number) => (
            <div 
              key={p.cluster} 
              onClick={() => setHighlightedCluster(highlightedCluster === p.cluster ? null : p.cluster)}
              className={`p-4 rounded-xl border border-slate-800/40 cursor-pointer transition-all ${
                highlightedCluster === p.cluster ? 'bg-slate-900/90 border-indigo-500 shadow-xl' : 'bg-slate-900/40 hover:bg-slate-900/60'
              }`}
              style={{ borderTop: `3px solid ${CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length]}` }}
            >
              <div className="flex justify-between">
                <h4 className="font-bold text-sm text-slate-100">Klaster {i+1}</h4>
                <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-indigo-400 font-bold">{p.size} osób</span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Avg Earnings</span>
                  <span className="font-bold text-slate-300">
                    ${p.avgEarnings >= 1000 ? `${(p.avgEarnings / 1000).toFixed(1)}k` : p.avgEarnings}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1"><Percent className="w-3 h-3" /> Avg Rate</span>
                  <span className="font-bold text-slate-300">${p.avgHourlyRate}/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

