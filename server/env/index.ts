import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.get('/', (req, res) => {
  res.send('GitAssistant API is running');
});

// Example endpoint for idea analysis
app.post('/api/analyze-idea', async (req, res) => {
  const { idea } = req.body;
  
  if (!idea) {
    return res.status(400).json({ error: 'Idea is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analiza la siguiente propuesta de proyecto y devuelve un JSON con el stack recomendado y las skills necesarias: ${idea}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing idea:', error);
    res.status(500).json({ error: 'Failed to analyze idea' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
