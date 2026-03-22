'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis, Legend } from 'recharts';

import { Sliders, Activity, ArrowRight, Loader2 } from 'lucide-react';

const CLUSTER_COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ec4899', '#14b8a6'];

export default function WhatIfSimulator() {
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  
  // Dane modelu (Centroidy i Skalery)
  const [modelData, setModelData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userOptions, setUserOptions] = useState<any[]>([]);

  // Deltas (Suwaki)
  const [hourlyRateDelta, setHourlyRateDelta] = useState(0);
  const [earningsDelta, setEarningsDelta] = useState(0);

  const [simulationResult, setSimulationResult] = useState<any>(null);

  useEffect(() => {
    // 1. Zbuduj model (Pociągaj K-Means żeby dostać centroidy)
    fetch('/api/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ k: 4 }) // 4 klastry
    })
      .then(res => res.json())
      .then(json => {
        setModelData(json);
        // Wybieramy losowe 5 profili do wyboru dla widoku
        setUserOptions(json.points.slice(0, 5));
        setSelectedUser(json.points[0]);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const runSimulation = async (hDelta: number, eDelta: number) => {
    if (!selectedUser || !modelData) return;
    setRecalculating(true);

    try {
      const res = await fetch('/api/what-if', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseVector: [selectedUser.hourlyRate, selectedUser.earnings],
          changes: { hourlyRateDelta: hDelta, earningsDelta: eDelta },
          centroids: modelData.centroids,
          minMax: modelData.minMax
        })
      });

      const json = await res.json();
      setSimulationResult(json);
    } catch (err) {
      console.error(err);
    } finally {
      setRecalculating(false);
    }
  };

  const handleSliderChange = (type: string, value: number) => {
    let nextH = hourlyRateDelta;
    let nextE = earningsDelta;

    if (type === 'H') {
      setHourlyRateDelta(value);
      nextH = value;
    } else {
      setEarningsDelta(value);
      nextE = value;
    }

    runSimulation(nextH, nextE);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] bg-slate-900/40 rounded-2xl border border-slate-800">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-mono text-sm">Ładowanie modelu K-Means...</p>
      </div>
    );
  }

  // Budowanie punktu do wyświetlenia – Original i Simulated
  const pointsToShow: any[] = [];

  if (selectedUser) {
    pointsToShow.push({
      ...selectedUser,
      type: 'Original',
      cluster: selectedUser.cluster,
      label: 'Pierwotny'
    });
  }

  if (simulationResult) {
    pointsToShow.push({
      hourlyRate: simulationResult.newVector[0],
      earnings: simulationResult.newVector[1],
      cluster: simulationResult.newCluster,
      type: 'Simulated',
      label: 'Symulowany'
    });
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full text-slate-100 p-2">
      {/* Panel boczny */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6 bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" /> Symulacja "Co-Jeśli"
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400">Profil Bazowy</label>
            <select
              value={selectedUser?.id || ''}
              onChange={(e) => {
                const user = userOptions.find(u => u.id === e.target.value);
                setSelectedUser(user);
                setHourlyRateDelta(0);
                setEarningsDelta(0);
                setSimulationResult(null);
              }}
              className="w-full bg-slate-800 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg mt-1 text-sm outline-none"
            >
              {userOptions.map((u: any) => (
                <option key={u.id} value={u.id}>
                    {u.id} - klaster {u.cluster + 1} (${u.hourlyRate}/h)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400">Zmiana stawki (HourlyRate)</label>
            <input 
              type="range" min="-50" max="50" value={hourlyRateDelta} 
              onChange={(e) => handleSliderChange('H', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-1"
            />
            <div className="flex justify-between text-xs text-indigo-400 font-mono">
              <span>$-50</span>
              <span className="font-bold">{hourlyRateDelta > 0 ? `+$${hourlyRateDelta}` : `$${hourlyRateDelta}`}</span>
              <span>$+50</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400">Zmiana zarobków (Earnings)</label>
            <input 
              type="range" min="-10000" max="10000" step="500" value={earningsDelta} 
              onChange={(e) => handleSliderChange('E', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-1"
            />
            <div className="flex justify-between text-xs text-green-400 font-mono">
              <span>$-10k</span>
              <span className="font-bold">{earningsDelta > 0 ? `+$${earningsDelta}` : `$${earningsDelta}`}</span>
              <span>$+10k</span>
            </div>
          </div>
        </div>

        {simulationResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider">WYNIK KLASYFIKACJI</h4>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: CLUSTER_COLORS[selectedUser.cluster % 4] }}>
                Klaster {selectedUser.cluster + 1}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold" style={{ color: CLUSTER_COLORS[simulationResult.newCluster % 4] }}>
                Klaster {simulationResult.newCluster + 1}
              </span>
            </div>
            {selectedUser.cluster !== simulationResult.newCluster ? (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Nastąpiło przesunięcie do nowego klastra!
              </p>
            ) : (
              <p className="text-xs text-slate-500">Profil przesunął się, ale pozostał w tym samym klastrze.</p>
            )}
          </div>
        )}
      </div>

      {/* Centrum - Wykres */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative flex items-center justify-center bg-slate-950/70 p-5 rounded-2xl border border-slate-800/50 shadow-2xl h-[400px]">
          {recalculating && (
            <div className="absolute top-4 right-4 z-10">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
            </div>
          )}
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.4} />
              <XAxis 
                type="number" 
                dataKey="hourlyRate" 
                name="HourlyRate" 
                stroke="#64748b" 
                fontSize={11}
                tickFormatter={(val) => `$${val}`}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <YAxis 
                type="number" 
                dataKey="earnings" 
                name="Earnings" 
                stroke="#64748b" 
                fontSize={11}
                tickFormatter={(val) => `$${val >= 1000 ? (val/1000)+'k' : val}`}
                domain={['dataMin - 1000', 'dataMax + 1000']}
              />
              <ZAxis type="number" range={[100, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3', stroke: '#cbd5e1', opacity: 0.1 }} />
              
              {/* TŁO: Centroidy lub wszystkie punkty kandydujące */}
              {modelData?.centroids.map((centroid: number[], i: number) => (
                <Scatter 
                  key={`centroid-${i}`}
                  name={`Środek klastra ${i+1}`}
                  data={[{ 
                    hourlyRate: centroid[0] * (modelData.minMax.hourlyRate.max - modelData.minMax.hourlyRate.min) + modelData.minMax.hourlyRate.min,
                    earnings: centroid[1] * (modelData.minMax.earnings.max - modelData.minMax.earnings.min) + modelData.minMax.earnings.min
                  }]}
                  fill="#1e293b"
                  stroke={CLUSTER_COLORS[i % 4]}
                  strokeWidth={1}
                  opacity={0.3}
                />
              ))}

              {/* DWA PUNKTY: Original i Symulowany */}
              {pointsToShow.map((p: any) => (
                <Scatter 
                  key={p.type}
                  name={p.label}
                  data={[p]} 
                  fill={CLUSTER_COLORS[p.cluster % 4]} 
                  shape={p.type === 'Original' ? 'circle' : 'cross'}
                  opacity={1}
                />
              ))}
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
