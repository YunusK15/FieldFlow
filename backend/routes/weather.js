const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/risk', auth, async (req, res) => {
  const lat = req.query.lat || '37.7749'; // Default latitude (San Francisco)
  const lon = req.query.lon || '-122.4194'; // Default longitude

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Latitude and longitude must be valid numeric values.' });
  }
  if (latitude < -90 || latitude > 90) {
    return res.status(400).json({ error: 'Latitude must be between -90 and 90 degrees.' });
  }
  if (longitude < -180 || longitude > 180) {
    return res.status(400).json({ error: 'Longitude must be between -180 and 180 degrees.' });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Weather API request failed');
    const data = await response.json();

    if (!data.current) {
      throw new Error('Invalid response structure from weather API');
    }

    const current = data.current;
    const temp = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const precip = current.precipitation;

    // --- Dynamic Pest Risk Logic (Scores from 0 to 100) ---
    
    // 1. Slugs & Snails: High humidity, moderate/cool temperatures, and rain/moisture
    let slugRisk = 10;
    if (humidity > 70) slugRisk += 30;
    if (humidity > 85) slugRisk += 20;
    if (temp >= 10 && temp <= 22) slugRisk += 20; // Optimal active temperature
    if (precip > 0) slugRisk += 20;
    slugRisk = Math.min(slugRisk, 100);

    // 2. Caterpillars: Warm temperatures and high humidity
    let caterpillarRisk = 15;
    if (temp >= 18 && temp <= 28) caterpillarRisk += 40;
    if (humidity > 60) caterpillarRisk += 25;
    if (precip === 0) caterpillarRisk += 10; // Moths prefer dry nights to lay eggs
    caterpillarRisk = Math.min(caterpillarRisk, 100);

    // 3. Beetles: Hot and dry conditions
    let beetleRisk = 20;
    if (temp > 22) beetleRisk += 30;
    if (temp > 28) beetleRisk += 10;
    if (humidity < 60) beetleRisk += 20;
    if (precip === 0) beetleRisk += 20;
    beetleRisk = Math.min(beetleRisk, 100);

    // 4. Ants: Warm, dry conditions (ideal for foraging)
    let antRisk = 20;
    if (temp > 20) antRisk += 40;
    if (humidity < 55) antRisk += 20;
    if (precip === 0) antRisk += 20;
    antRisk = Math.min(antRisk, 100);

    // Dynamic advice statements
    const advice = [];
    if (slugRisk > 70) {
      advice.push({ pest: 'slugs', level: 'High', tip: 'Damp and wet conditions detected. Slugs are highly active. Use beer traps or copper bands to shield seedlings.' });
    }
    if (caterpillarRisk > 70) {
      advice.push({ pest: 'caterpillars', level: 'High', tip: 'Warm and humid conditions favor caterpillar growth. Check underside of leaves for moth eggs.' });
    }
    if (beetleRisk > 70) {
      advice.push({ pest: 'beetles', level: 'High', tip: 'Dry and hot weather increases beetle activity. Set up row covers and do early morning handpicking.' });
    }
    if (advice.length === 0) {
      advice.push({ pest: 'general', level: 'Low', tip: 'Weather is currently stable. Maintain regular inspections for early signs of garden activity.' });
    }

    res.json({
      location: { lat, lon },
      weather: { temp, humidity, precipitation: precip },
      risks: [
        { name: 'slug', riskScore: slugRisk, icon: '🐌', color: '#f87171' },
        { name: 'catterpillar', riskScore: caterpillarRisk, icon: '🐛', color: '#fbbf24' },
        { name: 'beetle', riskScore: beetleRisk, icon: '🪲', color: '#60a5fa' },
        { name: 'ants', riskScore: antRisk, icon: '🐜', color: '#c084fc' }
      ],
      advice
    });

  } catch (err) {
    console.error('Weather advisor failed:', err);
    res.status(500).json({ error: 'Failed to retrieve weather-based risk metrics.' });
  }
});

module.exports = router;
