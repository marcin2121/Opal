const fs = require('fs');
const path = require('path');

function generateFreelancers(count = 500) {
  const categories = ['Software Dev', 'Design & Creative', 'Marketing', 'Writing & Translation'];
  const platforms = ['Upwork', 'Fiverr', 'Freelancer'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];

  const freelancers = [];

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];

    let hourlyRate = 0;
    let earnings = 0;
    let successRate = 0;
    let hoursPerWeek = 0;

    // Uzależnienie od klastrów statystycznych do imitacji K-Means
    const randomClass = Math.random();

    if (randomClass < 0.2) {
      // "Whales / Elite" - High rate, high earnings
      hourlyRate = Math.floor(Math.random() * 80) + 120; // 120 - 200
      earnings = Math.floor(Math.random() * 80000) + 70000; // 70k - 150k
      successRate = Math.floor(Math.random() * 5) + 95; // 95 - 100%
      hoursPerWeek = Math.floor(Math.random() * 20) + 20; // 20 - 40h
    } else if (randomClass < 0.5) {
      // "Grinders" - Low rate, mid-high earnings (high volume)
      hourlyRate = Math.floor(Math.random() * 30) + 20; // 20 - 50
      earnings = Math.floor(Math.random() * 35000) + 15000; // 15k - 50k
      successRate = Math.floor(Math.random() * 15) + 80; // 80 - 95%
      hoursPerWeek = Math.floor(Math.random() * 15) + 35; // 35 - 50h
    } else {
      // "Casual / Starters" - Low/mid Rate, low earnings
      hourlyRate = Math.floor(Math.random() * 40) + 15; // 15 - 55
      earnings = Math.floor(Math.random() * 8000) + 500;  // 500 - 8500
      successRate = Math.floor(Math.random() * 30) + 60; // 60 - 90%
      hoursPerWeek = Math.floor(Math.random() * 20) + 5;  // 5 - 25h
    }

    // Korekta regionów lub kategorii
    if (category === 'Software Dev') {
      hourlyRate += 15;
      earnings += 5000;
    }

    freelancers.push({
      id: `FL_${1000 + i}`,
      hourlyRate,
      earnings,
      successRate,
      hoursPerWeek,
      platform,
      category,
      region
    });
  }

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)){
      fs.mkdirSync(dataDir);
  }

  fs.writeFileSync(path.join(dataDir, 'freelancers_clean.json'), JSON.stringify(freelancers, null, 2));
  console.log(`Generated ${count} freelancer profiles to data/freelancers_clean.json`);
}

generateFreelancers(500);
