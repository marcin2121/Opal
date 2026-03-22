import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'freelancers_clean.json');
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: 'Brak pliku z danymi.' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const freelancers = JSON.parse(fileContent);

    const platforms = Array.from(new Set(freelancers.map((f: any) => f.platform))).filter(Boolean);
    const categories = Array.from(new Set(freelancers.map((f: any) => f.category))).filter(Boolean);
    const regions = Array.from(new Set(freelancers.map((f: any) => f.region))).filter(Boolean);

    return NextResponse.json({
      metadata: {
        total: freelancers.length,
        platforms,
        categories,
        regions
      },
      sample: freelancers.slice(0, 100)
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Nie udało się wczytać danych.' },
      { status: 500 }
    );
  }
}
