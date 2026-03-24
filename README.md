# Freelancer Analytics & Clustering Dashboard

Profesjonalny panel analityczny Business Intelligence (BI) zbudowany w ekosystemie **Next.js (App Router v16)**. Aplikacja służy do nienadzorowanego uczenia maszynowego (**K-Means Clustering**) na rzeczywistych danych rynkowych dotyczących pracy freelancerów, bez konieczności integracji z zewnętrznymi mikroserwisami Pythona (np. FastAPI/Flask), co unifikuje architekturę całego systemu.



---

## 🏗️ Architektura i Technologie

*   **Framework**: Next.js (App Router v16)
*   **Język**: TypeScript
*   **Klasyfikacja (ML)**: `ml-kmeans` (silnik klastrowania po stronie serwera)
*   **Wizualizacja**: `recharts` (ScatterChart, LineChart, RadarChart)
*   **Stylizacja**: Tailwind CSS v4 (Dark mode, neon glow, szklany minimalizm)
*   **Icons**: `lucide-react`


---

## 📂 Struktura Projektu i Moduły

### 1. Panel Główny (Landing Page) `/`
Przejrzysta nawigacja i podsumowanie technologii klastrowej na pokładzie.

### 2. Cluster Explorer `/explorer`
Serce aplikacji wykorzystywane do wielowymiarowego bindowania danych:
*   **Główny Wykres Matrix**: Mapuje punkty na siatce 2D (np. Stawka vs Zarobki).
*   **Metoda Łokcia (Elbow Plot)**: Diagnostyczny wykres matematyczny (Inertia/SSE) pokazujący optymalną liczbę klastrów ($k$).
*   **Wykres Radarowy (Spider Chart)**: Profilowanie średnich parametrów klastra (Zarobki, Stawka, Rating, Marketing, Skuteczność).
*   **Scenariusze Badawcze (Preset BI)**: Szybkie wglądy (np. *Zwrot z Reklamy ROI*, *Elastyczność Cenowa*).
*   **Filtry dynamiczne**: Sortowanie po *Platformie*, *Kategorii* oraz *Regionie*.

### 3. What-If Simulator `/what-if`
Narzędzie prognostyczne:
*   Wybierz profil freelancera i za pomocą suwaków **zmieniaj jego stawkę lub budżet reklamowy**.
*   Aplikacja przelicza **odległość Euklidesową** do centroidów i na żywo animuje przeskok do innej grupy (np. z klastra *Startujący* do *Eksperci*).

---

## ⚙️ Potok Przetwarzania Danych (Data Pipeline)

1.  **Dane Wejściowe**: Plik ze zbioru Kaggle `data/freelancer_earnings_bd.csv`.
2.  **Oczyszczanie**: Skrypt na backendzie `scripts/prepare-data.js` parsuje CSV i mapuje zmienne na format JSON.
3.  **Skalowanie**: W `/api/train` wektory są normalizowane metodą **Min-Max Scaling** (do przedziału $[0,1]$), co zapobiega dominacji zmiennych o dużych rzędach wielkości (np. Zarobki vs Rating).
4.  **Silnik Core**: Klasyfikacja klastrów uruchamiana jest dynamicznie przez `runKmeans()` w route handlerze.

---

## 🚀 Instalacja i Uruchomienie

1.  Zainstaluj zależności:
    ```bash
    npm install
    ```
2.  Przelicz i zaktualizuj plik z danymi (wygeneruj `.json` z `.csv`):
    ```bash
    node scripts/prepare-data.js
    ```
3.  Uruchom serwer developerski:
    ```bash
    npm run dev
    ```
4.  Otwórz przeglądarkę pod adresem: `http://localhost:3000` (lub innym wskazanym w konsoli).

---

## 📈 Zastosowanie Akademickie
Projekt stanowi świetne case-study na obronę pracy dyplomowej lub prezentację biznesową, udowadniając, że interaktywne potoki ML można z powodzeniem wdrażać na szybkich, natywnych strukturach frontendowych bez konieczności migracji danych do Pythona w mniejszych analizach.
