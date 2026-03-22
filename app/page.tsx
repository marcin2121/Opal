import Link from 'next/link';
import { Activity, LayoutDashboard, Sliders, FileText } from 'lucide-react';

export default function DashboardPage() {
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
                Data Science Dashboard
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Panel Badawczy | Praca Magisterska
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-slate-100 via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            Freelancer Earnings Analytics
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-slate-400 leading-relaxed mx-auto">
            Analiza statystyczna (K-Means) bazy danych z Kaggle w 100% zaimplementowana w środowisku Node.js i Next.js App Router bez użycia Pythona.
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Link href="/explorer" className="group bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 hover:border-indigo-500/40 transition hover:bg-slate-900 flex flex-col items-start gap-4 shadow-xl">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20">
              <LayoutDashboard className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Cluster Explorer</h3>
              <p className="text-xs text-slate-400 mt-1">Mapa klastrów 2D z filtrami i możliwością dynamicznego trenowania (K-Means).</p>
            </div>
          </Link>

          <Link href="/what-if" className="group bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 hover:border-indigo-500/40 transition hover:bg-slate-900 flex flex-col items-start gap-4 shadow-xl">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20">
              <Sliders className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">What-If Simulator</h3>
              <p className="text-xs text-slate-400 mt-1">Zmieniaj parametry freelancera i animuj przeskok między klastrami na mapie.</p>
            </div>
          </Link>

          <Link href="/methodology" className="group bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50 hover:border-indigo-500/40 transition hover:bg-slate-900 flex flex-col items-start gap-4 shadow-xl">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 group-hover:bg-indigo-500/20">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">Methodology Story</h3>
              <p className="text-xs text-slate-400 mt-1">Opis krok po kroku pozyskiwania i czyszczenia danych oraz doboru parametru k.</p>
            </div>
          </Link>

        </section>

        <div className="mt-8">
            <Link href="/explorer" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition shadow-md shadow-indigo-500/10">
                Przejdź do analizy K-Means
            </Link>
        </div>

      </main>
    </div>
  );
}
