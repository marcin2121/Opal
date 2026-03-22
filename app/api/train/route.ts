import { NextResponse, NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// Używamy dynamicznego requira do wyciągnięcia funkcji kmeans z modułu
const { kmeans } = require('ml-kmeans');
// Opcjonalne zabezpieczenie na wypadek różnych wersji modułu
const runKmeans = typeof kmeans === 'function' ? kmeans : require('ml-kmeans').default;

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const { k = 3, features = ['hourlyRate', 'earnings'], filters = {} } = body;

    const dataPath = path.join(process.cwd(), 'data', 'freelancers_clean.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const freelancers = JSON.parse(fileContent);

    // 1. Nakładanie filtrów
    let filteredFreelancers = freelancers.filter((f: any) => {
      if (filters.platform && filters.platform.length > 0 && !filters.platform.includes(f.platform)) return false;
      if (filters.category && filters.category.length > 0 && !filters.category.includes(f.category)) return false;
      if (filters.region && filters.region.length > 0 && !filters.region.includes(f.region)) return false;
      return true;
    });

    if (filteredFreelancers.length < k) {
      return NextResponse.json({ error: `Za mało punktów (${filteredFreelancers.length}) dla k=${k}` }, { status: 400 });
    }

    // 2. Budowanie macierzy cech number[][]
    const vectors = filteredFreelancers.map((f: any) => {
      return features.map((feature: string) => f[feature]);
    });

    // 3. Normalizacja Min-Max
    const minMax: any = {};
    features.forEach((feature: string, index: number) => {
      const values = vectors.map((v: number[]) => v[index]);
      minMax[feature] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });

    const scaledVectors = vectors.map((v: number[]) => {
      return v.map((val: number, i: number) => {
        const feat = features[i];
        const range = minMax[feat].max - minMax[feat].min;
        return range === 0 ? 0 : (val - minMax[feat].min) / range;
      });
    });

    // 4. Uruchomienie K-Means
    const result = runKmeans(scaledVectors, k, { initialization: 'kmeans++', maxIterations: 100 });
    const clusterLabels = result.clusters;

    // DIAGNOSTYKA: Metoda Łokcia (SSE dla k=1..7)
    const elbowData: any[] = [];
    for (let testK = 1; testK <= 7; testK++) {
      try {
        const testResult = runKmeans(scaledVectors, testK, { initialization: 'kmeans++', maxIterations: 50 });
        if (testResult && testResult.clusters && testResult.centroids) {
          // Ręczne liczenie SSE (Sum of Squared Errors)
          let sse = 0;
          for (let idx = 0; idx < scaledVectors.length; idx++) {
            const clusterIdx = testResult.clusters[idx];
            const centroid = testResult.centroids[clusterIdx];
            const point = scaledVectors[idx];
            
            // Sum( (p_i - c_i)^2 )
            let distSq = 0;
            for (let f = 0; f < point.length; f++) {
              distSq += Math.pow(point[f] - centroid[f], 2);
            }
            sse += distSq;
          }
          
          elbowData.push({ k: testK, sse: Math.floor(sse * 100) / 100 });
        }
      } catch (e) {
        // Zabezpieczenie na wypadek błędu dla małych K
      }
    }


    // 5. Dopasowanie punktów i podsumowanie

    const points = filteredFreelancers.map((f: any, index: number) => ({
      ...f,
      cluster: clusterLabels[index],
      // Do wizualizacji użyjemy 2 pierwszych cech lub pre-skalowanych
      x: f[features[0]], 
      y: f[features[1]]
    }));

    // 6. Profilowanie klastrów (średnie metryki)
    const clusterProfiles = Array.from({ length: k }, (_, clusterId) => {
      const clusterPoints = points.filter((p: any) => p.cluster === clusterId);
      const size = clusterPoints.length;

      if (size === 0) return { cluster: clusterId, size: 0 };

      // Obliczanie średnich
      const avgHourlyRate = Math.floor(clusterPoints.reduce((s: number, p: any) => s + p.hourlyRate, 0) / size);
      const avgEarnings = Math.floor(clusterPoints.reduce((s: number, p: any) => s + p.earnings, 0) / size);
      const avgSuccessRate = Math.floor(clusterPoints.reduce((s: number, p: any) => s + p.successRate, 0) / size);
      const avgClientRating = Math.floor((clusterPoints.reduce((s: number, p: any) => s + p.clientRating, 0) / size) * 10) / 10;
      const avgMarketingSpend = Math.floor(clusterPoints.reduce((s: number, p: any) => s + p.marketingSpend, 0) / size);
      const avgRehireRate = Math.floor(clusterPoints.reduce((s: number, p: any) => s + p.rehireRate, 0) / size);

      return {
        cluster: clusterId,
        size,
        avgHourlyRate,
        avgEarnings,
        avgSuccessRate,
        avgClientRating,
        avgMarketingSpend,
        avgRehireRate
      };

    });

    return NextResponse.json({
      k,
      features,
      points,
      clusterProfiles,
      centroids: result.centroids, // Centroidy w skali 0-1
      minMax,                      // Współczynniki skalerów
      elbowData                    // Diagnostyka łokcia
    });



  } catch (error: any) {
    console.error('K-Means Error:', error);
    return NextResponse.json({ error: error.message || 'Wystąpił błąd podczas K-Means.' }, { status: 500 });
  }
}
