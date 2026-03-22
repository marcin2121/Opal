import { NextResponse } from 'next/server';

const OPENDOTA_API = 'https://api.opendota.com/api';

export async function GET() {
  try {
    // 1. Pobieramy 5 ostatnich profesjonalnych meczów, które zawsze są w pełni przeanalizowane
    const resMatches = await fetch(`${OPENDOTA_API}/proMatches`, { next: { revalidate: 3600 } });
    if (!resMatches.ok) throw new Error('Błąd pobierania listy meczów');
    const matches = await resMatches.json();
    
    // Bierzemy 5 meczów dla uzyskania 50 danych graczy (10 na mecz)
    const recentMatches = matches.slice(0, 5);
    
    // 2. Pobieramy szczegóły dla każdego meczu równolegle
    const detailPromises = recentMatches.map(async (m: any) => {
      const res = await fetch(`${OPENDOTA_API}/matches/${m.match_id}`, { next: { revalidate: 3600 } });
      if (!res.ok) return { players: [] }; // Zabezpieczenie na wypadek błędu jednego meczu
      const data = await res.json();
      return { match_id: m.match_id, players: data.players || [] };
    });

    const detailedMatches = await Promise.all(detailPromises);
    
    // 3. Spłaszczamy tablicę do pojedynczych graczy i klastrujemy ich na bieżąco
    const formattedData: any[] = [];
    
    detailedMatches.forEach((m: any) => {
      m.players.forEach((p: any) => {
        const gpm = p.gold_per_min || 0;
        const damage = p.hero_damage || 0;
        
        // Zabezpieczenie przed brakującymi danymi
        if (gpm === 0 && damage === 0) return;

        // Klasyfikacja oparta na logice gry (deterministyczna)
        let cluster_name = 'Hard Supports';
        if (gpm >= 600) {
          cluster_name = 'Hard Carries';
        } else if (gpm >= 400) {
          cluster_name = 'Space Creators';
        }

        formattedData.push({
          id: `${m.match_id}_${p.player_slot}`,
          match_id: m.match_id,
          gold_per_min: gpm,
          hero_damage: damage,
          cluster_name
        });
      });
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Dota API Error:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać prawdziwych danych o graczach.' },
      { status: 500 }
    );
  }
}
