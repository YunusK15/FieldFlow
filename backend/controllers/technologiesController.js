const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const Technology = require('../models/Technology');

// Resolve paths to the Python executable and news scrape script
const projectRoot = path.resolve(__dirname, '..', '..');
const pythonExe = process.platform === 'win32'
  ? path.join(projectRoot, 'venv', 'Scripts', 'python.exe')
  : path.join(projectRoot, 'venv', 'bin', 'python');
const scrapeScript = path.join(projectRoot, 'scrape_news.py');

const getTechnologies = async (req, res) => {
  try {
    const technologies = await Technology.find().sort({ isNews: -1, _id: -1 }).lean();
    res.json(technologies);
  } catch (err) {
    console.error('Failed to fetch technologies:', err);
    res.status(500).json({ error: 'Failed to fetch technologies data.' });
  }
};

const syncTechnologies = async (req, res) => {
  const pythonProcess = spawn(pythonExe, [scrapeScript], {
    cwd: projectRoot
  });

  let resultData = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
    console.error(`Python news scraper stderr: ${data}`);
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start news scraper process:', err);
    res.status(500).json({ error: 'Failed to start news sync engine.' });
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      console.error(`Scraper exited with code ${code}, stderr: ${errorData}`);
      return res.status(500).json({ error: 'News sync engine failed.' });
    }

    try {
      const articles = JSON.parse(resultData.trim());
      if (articles.error) {
        return res.status(500).json({ error: articles.error });
      }
      if (Array.isArray(articles) && articles.length === 1 && articles[0].error) {
        return res.status(500).json({ error: articles[0].error });
      }

      // Keyword to Emoji map helper
      const mapEmoji = (title, desc) => {
        const text = `${title} ${desc}`.toLowerCase();
        if (text.includes('drone') || text.includes('aerial') || text.includes('fly') || text.includes('uav')) return '🛸';
        if (text.includes('soil') || text.includes('sensor') || text.includes('moisture') || text.includes('iot') || text.includes('sensor')) return '📡';
        if (text.includes('water') || text.includes('irrigation') || text.includes('drip') || text.includes('rain')) return '💧';
        if (text.includes('ai') || text.includes('intelligence') || text.includes('model') || text.includes('learning') || text.includes('algorithm')) return '🧠';
        if (text.includes('vertical') || text.includes('indoor') || text.includes('hydroponic') || text.includes('greenhouse')) return '🏢';
        if (text.includes('gps') || text.includes('precision') || text.includes('satellite') || text.includes('map')) return '📍';
        if (text.includes('protein') || text.includes('food') || text.includes('cell') || text.includes('meat') || text.includes('plant-based') || text.includes('seafood') || text.includes('shrimp')) return '🌱';
        if (text.includes('animal') || text.includes('welfare') || text.includes('cow') || text.includes('livestock') || text.includes('fermentation')) return '🐄';
        return '📰';
      };

      // Loop through articles and upsert them by title to prevent duplication
      for (const article of articles) {
        const icon = mapEmoji(article.title, article.description);
        await Technology.findOneAndUpdate(
          { title: article.title },
          {
            icon,
            title: article.title,
            tagline: article.tagline,
            description: article.description,
            benefits: article.benefits,
            isNews: true,
            sourceUrl: article.sourceUrl || ''
          },
          { upsert: true, returnDocument: 'after' }
        );
      }

      // Fetch full list to return (news first, then newest records first)
      const updatedList = await Technology.find().sort({ isNews: -1, _id: -1 }).lean();
      res.json(updatedList);

    } catch (err) {
      console.error('Failed to parse scraper output:', err, 'Result:', resultData);
      res.status(500).json({ error: 'Failed to process news synchronization output.' });
    }
  });
};

module.exports = {
  getTechnologies,
  syncTechnologies
};
