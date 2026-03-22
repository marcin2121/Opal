const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    const matches = await fetchJson('https://api.opendota.com/api/proMatches');
    const matchId = matches[0].match_id;
    console.log(`Fetching pro match details for ${matchId}`);
    const match = await fetchJson(`https://api.opendota.com/api/matches/${matchId}`);
    if (match.players) {
      const players = match.players.map(p => ({
        gpm: p.gold_per_min,
        damage: p.hero_damage,
        kills: p.kills,
        deaths: p.deaths,
        hero_id: p.hero_id
      }));
      console.log(JSON.stringify(players.slice(0, 10), null, 2));
    } else {
      console.log("No players found");
    }
  } catch (err) {
    console.error(err);
  }
}

run();
