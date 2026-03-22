import WhatIfSimulator from '@/components/what-if-simulator';
import { Activity } from 'lucide-react';

export default function WhatIfPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Pasek Nawigacji / Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100">
                What-If Simulator
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Model K-Means | Symulacja Przesunięć
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-8 space-y-8">
        <section className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-slate-100">Dynamic Decision Matrix</h2>
            <p className="text-sm text-slate-400 max-w-xl">Zmień parametry freelancera i zobacz, jak odległość euklidesowa od centroidów klastra przesuwa go na mapie 2D.</p>
        </section>

        <section className="w-full">
          <WhatIfSimulator />
        </section>
      </main>
    </div>
  );
}
