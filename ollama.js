const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const myprompt = "Resume this text in english";

// Utiliser cors pour accepter les requêtes cross-origin
app.use(cors());
// Utiliser bodyParser pour parser les requêtes JSON
app.use(bodyParser.json({ limit: '50mb' })); // Vous pouvez ajuster cette valeur en fonction de vos besoins


app.post('/summarize', async (req, res) => {
  const content = req.body.content;

  try {
    const summary = await generateSummary(content);
    res.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

async function generateSummary(text) {
  const url = 'http://localhost:11434/api/generate';
  const model = 'llama3:8B';
  const prompt = myprompt +  text;

  const responseStream = await axios.post(url, {
    model,
    prompt
  }, {
    responseType: 'stream'
  });

  return new Promise((resolve, reject) => {
    let summary = '';
    responseStream.data.on('data', (chunk) => {
      try {
        const data = JSON.parse(chunk.toString());
        if (data.response) {
          summary += data.response;
        }
      } catch (e) {
        console.error('Error parsing chunk', e);
      }
    });

    responseStream.data.on('end', () => {
      resolve(summary);
    });

    responseStream.data.on('error', (err) => {
      reject(err);
    });
  });
}

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
