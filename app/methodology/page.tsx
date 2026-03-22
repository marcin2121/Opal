import { CheckCircle, Database, Layout, Sliders, TrendingUp } from 'lucide-react';

export default function MethodologyPage() {
  const steps = [
    {
      title: "Pozyskanie Danych (Kaggle)",
      icon: Database,
      desc: "Zbiór danych 'Freelancer Earnings' w formacie CSV został wklejony do folderu /data. Zawiera 1950 rekordów rzeczywistych freelancerów.",
      color: "text-blue-400"
    },
    {
      title: "Preprocessing offline (Node.js)",
      icon: CheckCircle,
      desc: "Skrypt `scripts/prepare-data.js` parsuje CSV, oczyszcza znaki, mapuje kolumny i zapisuje do formatu JSON bez wsparcia Pythona.",
      color: "text-emerald-400"
    },
    {
      title: "Skalowanie Min-Max (Backend API)",
      icon: Sliders,
      desc: "Przed wywołaniem klastrowania, wektory parametrów są normalizowane do przedziału [0,1], aby zbalansować dysproporcje ($200k vs $200).",
      color: "text-amber-400"
    },
    {
      title: "K-Means Core",
      icon: TrendingUp,
      desc: "W route handlerze `/api/train` uruchamiana jest biblioteka `ml-kmeans`. Centroidy i etykiety wracają bezpośrednio do klienta.",
      color: "text-indigo-400"
    },
    {
      title: "Interaktywny Dashboard",
      icon: Layout,
      desc: "Recharts mapuje klastry 2D na wykresie Scatter. Dodano moduł filtracji oraz moduł 'Co-Jeśli' (Euclidean distance recalculations).",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Methodology & Story</h1>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-100">Architektura & Proces Badawczy</h2>
          <p className="text-sm text-slate-400">Praca dyplomowa: Implementacja K-Means na stosie JavaScript bez czarnej skrzynki Pythona.</p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-6 before:bg-slate-800/60 before:w-0.5">
          {steps.map((step, i) => (
            <div key={i} className="relative pl-16 flex flex-col gap-2">
              <div className="absolute left-0 mt-1 p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center">
                <step.icon className={`w-5 h-5 ${step.color}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-200">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
