# Freelancer Analytics & Clustering Dashboard

[Polski (PL)](#polski-pl) | [English (EN)](#english-en)

---

## English (EN)

Professional Business Intelligence (BI) analytics dashboard built with **Next.js (App Router v16)**. This application performs unsupervised machine learning (**K-Means Clustering**) on real freelancer market data, using a 100% Node.js/TypeScript environment (no external Python microservices required).

### 🏗️ Architecture & Technologies
*   **Framework**: Next.js (App Router v16)
*   **Language**: TypeScript
*   **ML Engine**: `ml-kmeans` (Server-side clustering)
*   **Visualization**: `recharts` (ScatterChart, LineChart, RadarChart)
*   **Styling**: Tailwind CSS v4 (Dark mode, neon glow, glassmorphism)
*   **Icons**: `lucide-react`

### 📂 Modules
1.  **Cluster Explorer** (`/explorer`): Multi-dimensional data exploration with:
    *   **Scatter Matrix**: Visualize correlations (e.g., Hourly Rate vs. Earnings).
    *   **Elbow Plot**: Mathematical diagnostics (SSE) to determine the optimal *k*.
    *   **Radar Chart**: Advanced profiling of clusters (Earnings, Rate, Rating, Marketing, Success %).
    *   **Insight Presets**: Predefined scenarios (ROI, Price Elasticity, Reputation).
2.  **What-If Simulator** (`/what-if`): Predictive tool to simulate profile shifts by adjusting parameters like rates or marketing spend.
3.  **Methodology**: Step-by-step breakdown of the data pipeline and research process.

### ⚙️ Data Pipeline
1.  **Input**: Kaggle `Freelancer Earnings` CSV dataset.
2.  **Preprocessing**: `scripts/prepare-data.js` script cleans and maps CSV to JSON.
3.  **Scaling**: Server-side **Min-Max Scaling** (normalization to [0,1]) for balanced clustering.
4.  **Core**: Dynamic clustering via `runKmeans()` in Next.js Route Handlers.

### 🚀 Setup
```bash
npm install
node scripts/prepare-data.js
npm run dev
```

---

## Polski (PL)

Profesjonalny panel analityczny Business Intelligence (BI) zbudowany w ekosystemie **Next.js (App Router v16)**. Aplikacja służy do nienadzorowanego uczenia maszynowego (**K-Means Clustering**) na rzeczywistych danych rynkowych dotyczących pracy freelancerów, bez konieczności integracji z zewnętrznymi mikroserwisami Pythona (np. FastAPI/Flask), co unifikuje architekturę całego systemu.

### 🏗️ Architektura i Technologie
*   **Framework**: Next.js (App Router v16)
*   **Język**: TypeScript
*   **Klasyfikacja (ML)**: `ml-kmeans` (silnik klastrowania po stronie serwera)
*   **Wizualizacja**: `recharts` (ScatterChart, LineChart, RadarChart)
*   **Stylizacja**: Tailwind CSS v4 (Dark mode, neon glow, szklany minimalizm)
*   **Icons**: `lucide-react`

### 📂 Struktura Projektu i Moduły
1.  **Cluster Explorer** (`/explorer`): Wielowymiarowe bindowanie danych:
    *   **Główny Wykres Matrix**: Mapowanie punktów na siatce 2D.
    *   **Metoda Łokcia (Elbow Plot)**: Diagnostyka SSE pokazująca optymalną liczbę klastrów ($k$).
    *   **Wykres Radarowy (Spider Chart)**: Profilowanie średnich parametrów klastra.
    *   **Scenariusze Badawcze (Preset BI)**: Szybkie wglądy (np. *Zwrot z Reklamy ROI*).
2.  **What-If Simulator** (`/what-if`): Narzędzie prognostyczne do symulacji przesunięć profili (Euclidean distance).
3.  **Metodologia**: Opis potoku danych i procesu badawczego krok po kroku.

### ⚙️ Potok Przetwarzania Danych (Data Pipeline)
1.  **Dane Wejściowe**: Zbiór Kaggle `data/freelancer_earnings_bd.csv`.
2.  **Preprocessing**: Skrypt `scripts/prepare-data.js` parsuje CSV i mapuje zmienne na format JSON.
3.  **Skalowanie**: **Min-Max Scaling** (normalizacja do $[0,1]$) w API `/api/train`.
4.  **Silnik Core**: Klasyfikacja klastrów przez `runKmeans()` w route handlerze.

### 🚀 Instalacja i Uruchomienie
```bash
npm install
node scripts/prepare-data.js
npm run dev
```
