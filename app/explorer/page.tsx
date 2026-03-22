import ClusterExplorer from '@/components/cluster-explorer';
import { Activity } from 'lucide-react';

export default function ExplorerPage() {
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
                K-Means Analytics
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Panel Badawczy | Freelancer Earnings Insights
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
            <h2 className="text-2xl font-bold text-slate-100">Data Explorer & Segmentation</h2>
            <p className="text-sm text-slate-400 max-w-xl">Interaktywna mapa klastrów freelancera na podstawie analizy statystycznej K-Means w środowisku Node/Next.js.</p>
        </section>

        <section className="w-full">
          <ClusterExplorer />
        </section>
      </main>
    </div>
  );
}
