import { NextResponse } from 'next/server';

// Używamy darmowego API CoinGecko do pobrania prawdziwych, historycznych danych
const COINGECKO_API = 'https://api.coingecko.com/api/v3/coins';

// Tokeny gamingowe, które analizujemy
const TOKENS = [
  { id: 'axie-infinity', symbol: 'AXS' },
  { id: 'the-sandbox', symbol: 'SAND' },
  { id: 'decentraland', symbol: 'MANA' }
];

export async function GET() {
  try {
    // Pobieramy dane z ostatnich 30 dni dla każdego tokena równolegle
    const fetchPromises = TOKENS.map(async (token) => {
      const res = await fetch(
        `${COINGECKO_API}/${token.id}/market_chart?vs_currency=usd&days=30&interval=daily`,
        { next: { revalidate: 3600 } } // Cache na 1 godzinę
      );
      
      if (!res.ok) throw new Error(`Błąd pobierania danych dla ${token.id}`);
      
      const data = await res.json();
      return { symbol: token.symbol, prices: data.prices };
    });

    const results = await Promise.all(fetchPromises);

    // Transformacja danych dla Recharts
    const formattedData: Record<string, any>[] = [];
    
    // Bierzemy długość tablicy pierwszego tokena jako bazę
    const basePrices = results[0].prices;
    
    basePrices.forEach((pricePoint: [number, number], index: number) => {
      const date = new Date(pricePoint[0]).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short'
      });
      
      const dayData: Record<string, any> = { date };
      
      results.forEach(result => {
        const tokenPrice = result.prices[index]?.[1] || 0; 
        dayData[result.symbol] = Number(tokenPrice.toFixed(3));
      });
      
      formattedData.push(dayData);
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać prawdziwych danych rynkowych.' },
      { status: 500 }
    );
  }
}
