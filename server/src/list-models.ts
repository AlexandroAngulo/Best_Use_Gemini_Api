import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function listAllModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  try {
    console.log("Listing all available models for your API Key...");
    // This is the official way to list models in newer SDKs
    // Note: It might be on a different sub-client or require a specific call
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models) {
      console.log("Models found:");
      data.models.forEach((m: any) => {
        console.log(`- ${m.name} (Supports: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } else {
      console.log("No models found. Response:", JSON.stringify(data));
    }
  } catch (e: any) {
    console.error("Error listing models:", e.message);
  }
}

listAllModels();
