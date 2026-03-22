import { NextResponse, NextRequest } from 'next/server';

const kmeans = require('ml-kmeans'); // Do debugu, ale tu liczymy k-means ręcznie odległością euklidesową

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      baseVector,     // [hourlyRate, earnings] przed zmianą (z bazy)
      changes,        // { hourlyRateDelta, earningsDelta }
      centroids,      // [[x, y], [x, y]] - Centroidy ze zwracanego train API
      minMax          // { hourlyRate: {min, max}, ... } - skalery
    } = body;

    if (!baseVector || !centroids || !minMax) {
      return NextResponse.json({ error: 'Brakujące parametry wektora bazowego lub centroidów.' }, { status: 400 });
    }

    // 1. Oblicz wektor po zmianie
    const newHourlyRate = baseVector[0] + (changes.hourlyRateDelta || 0);
    const newEarnings = baseVector[1] + (changes.earningsDelta || 0);

    const newVector = [newHourlyRate, newEarnings];

    // 2. Skalowanie Min-Max (Dokładnie tak samo jak w train!)
    const scale = (val: number, min: number, max: number) => {
      const range = max - min;
      return range === 0 ? 0 : (val - min) / range;
    };

    const scaledNewVector = [
      scale(newHourlyRate, minMax.hourlyRate.min, minMax.hourlyRate.max),
      scale(newEarnings, minMax.earnings.min, minMax.earnings.max)
    ];

    // 3. Oblicz dystans Euklidesowy do każdego centroidu
    const distances = centroids.map((centroid: number[]) => {
      // sqrt( sum( (x_i - c_i)^2 ) )
      const dx = scaledNewVector[0] - centroid[0];
      const dy = scaledNewVector[1] - centroid[1];
      return Math.sqrt(dx*dx + dy*dy);
    });

    // Znajdź najbliższy centroid (nowy klaster)
    const minDistance = Math.min(...distances);
    const newCluster = distances.indexOf(minDistance);

    return NextResponse.json({
      newVector,
      scaledNewVector,
      newCluster,
      distances
    });

  } catch (error: any) {
    console.error('What-If Error:', error);
    return NextResponse.json({ error: error.message || 'Błąd symulatora.' }, { status: 500 });
  }
}
