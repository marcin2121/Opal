import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Mock data generator for fallback when Supabase is not configured
function generateMockData(count = 100) {
  const clusters = [
    { name: 'Hard Supports', gpmRange: [150, 350], damageRange: [5000, 15000] },
    { name: 'Space Creators', gpmRange: [350, 550], damageRange: [15000, 35000] },
    { name: 'Hard Carries', gpmRange: [550, 850], damageRange: [20000, 45000] }
  ];

  return Array.from({ length: count }, (_, i) => {
    const cluster = clusters[Math.floor(Math.random() * clusters.length)];
    const gold_per_min = Math.floor(Math.random() * (cluster.gpmRange[1] - cluster.gpmRange[0]) + cluster.gpmRange[0]);
    const hero_damage = Math.floor(Math.random() * (cluster.damageRange[1] - cluster.damageRange[0]) + cluster.damageRange[0]);
    
    return {
      match_id: 1000000 + i,
      gold_per_min,
      hero_damage,
      cluster_name: cluster.name
    };
  });
}

export async function GET() {
  try {
    // Check if Supabase keys are configured
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials missing. Returning mock data.");
      return NextResponse.json(generateMockData(200));
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('dota_player_clusters')
      .select('match_id, gold_per_min, hero_damage, cluster_name')
      .limit(500);

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error('Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
