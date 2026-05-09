import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateSetupScript } from './github';
import { initTelegramBot, sendTelegramNotification } from './telegram';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize AI and Telegram
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
initTelegramBot();

app.get('/', (req, res) => {
  res.send('GitAssistant API is running');
});

// Endpoint for GitHub simulation/webhook
app.post('/api/webhooks/github', async (req, res) => {
  const { commits, repository } = req.body;

  if (!commits || commits.length === 0) {
    return res.status(400).json({ error: 'No commits found in payload' });
  }

  const latestCommit = commits[0];
  const repoName = repository.name;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
    const prompt = `Actúa como un mentor senior de software. Analiza este commit de GitHub:
    Repositorio: ${repoName}
    Mensaje: ${latestCommit.message}
    Autor: ${latestCommit.author.name}
    
    Proporciona una sugerencia técnica muy breve (máximo 2 frases) sobre posibles mejoras o riesgos relacionados con este cambio. 
    Sé profesional y constructivo.`;

    const result = await model.generateContent(prompt);
    const aiSuggestion = result.response.text();

    // Send Telegram Notification
    const telegramMsg = `🚀 *Nuevo Push en ${repoName}*\n\n` +
                        `📝 *Commit:* ${latestCommit.message}\n` +
                        `👤 *Por:* ${latestCommit.author.name}\n\n` +
                        `✨ *Sugerencia de Gemini:* \n${aiSuggestion}`;
    
    await sendTelegramNotification(telegramMsg);

    res.json({
      event: 'push',
      repo: repoName,
      commit: latestCommit.message,
      author: latestCommit.author.name,
      suggestion: aiSuggestion,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in webhook processing:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Endpoint for GitHub setup script generation
app.post('/api/github/setup', async (req, res) => {
  const { repoUrl, workflowType } = req.body;

  if (!repoUrl || !workflowType) {
    return res.status(400).json({ error: 'repoUrl and workflowType are required' });
  }

  try {
    const script = await generateSetupScript(repoUrl, workflowType);
    res.json({ script });
  } catch (error) {
    console.error('Error generating GitHub script:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to generate script' });
  }
});

// Example endpoint for idea analysis
app.post('/api/analyze-idea', async (req, res) => {
  const { idea } = req.body;
  
  if (!idea) {
    return res.status(400).json({ error: 'Idea is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });
    const prompt = `Analiza la siguiente propuesta de proyecto: "${idea}". 
    Responde ÚNICAMENTE con un objeto JSON válido, sin bloques de código markdown, sin texto adicional.
    El JSON debe tener esta estructura exacta:
    {
      "recommendedStack": ["tecnologia1", "tecnologia2"],
      "requiredSkills": ["skill1", "skill2"]
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean potential markdown blocks
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const jsonResponse = JSON.parse(text);
      res.json(jsonResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', text);
      res.status(500).json({ error: 'Failed to parse AI response' });
    }
  } catch (error) {
    console.error('Error analyzing idea:', error);
    res.status(500).json({ error: 'Failed to analyze idea' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
