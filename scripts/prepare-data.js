const fs = require('fs');
const path = require('path');

function processCsv() {
  const csvPath = path.join(__dirname, '..', 'data', 'freelancer_earnings_bd.csv');
  const jsonPath = path.join(__dirname, '..', 'data', 'freelancers_clean.json');

  if (!fs.existsSync(csvPath)) {
    console.error(`Nie znaleziono pliku: ${csvPath}`);
    return;
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n');

  if (lines.length < 2) {
    console.error('Plik CSV jest pusty lub uszkodzony.');
    return;
  }

  // Pobranie nagłówków z pierwszej linii
  const headers = lines[0].split(',').map(h => h.trim());
  
  const freelancers = [];

  // Pętla po liniach (od 1, pomijając nagłówek)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Prosty split po przecinku (Zabezpieczenie na wypadek braku cudzysłowów w tym podstawowym CSV)
    const values = line.split(',');

    if (values.length < headers.length) continue;

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : '';
    });


    // Mapowanie na format oczekiwany przez aplikację
    freelancers.push({
      id: `FL_${row['Freelancer_ID']}`,
      hourlyRate: parseFloat(row['Hourly_Rate']) || 0,
      earnings: parseFloat(row['Earnings_USD']) || 0,
      successRate: parseFloat(row['Job_Success_Rate']) || 0,
      clientRating: parseFloat(row['Client_Rating']) || 0,
      marketingSpend: parseFloat(row['Marketing_Spend']) || 0,
      rehireRate: parseFloat(row['Rehire_Rate']) || 0,
      jobsCompleted: parseInt(row['Job_Completed']) || 0,
      durationDays: parseInt(row['Job_Duration_Days']) || 0,
      category: row['Job_Category'],
      platform: row['Platform'],
      region: row['Client_Region']
    });

  }

  fs.writeFileSync(jsonPath, JSON.stringify(freelancers, null, 2));
  console.log(`Przetworzono ${freelancers.length} rekordów do data/freelancers_clean.json`);
}

processCsv();
