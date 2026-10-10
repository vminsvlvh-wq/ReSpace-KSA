import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Multi-turn Gemini chat API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, systemInstruction, model = 'gemini-3.5-flash' } = req.body;

      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({
          text: 'تنبيه: مفتاح GEMINI_API_KEY غير متوفر حالياً في متغيرات البيئة. سيتم الإجابة بناءً على قاعدة البيانات المحلية للمشروع.',
        });
      }

      // Format messages into contents array: [{ role: 'user' | 'model', parts: [{ text }] }]
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: model,
        contents,
        config: {
          systemInstruction:
            systemInstruction ||
            'You are an expert bilingual architectural consultant, renovation specialist, and financial feasibility advisor for ReSpace KSA (ري سبيس). Provide accurate, professional, and practical guidance strictly adhering to the Saudi Building Code (SBC) and real estate market context in Riyadh and Jeddah. Answer politely in the user\'s language (Arabic or English).',
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error generating chat content:', error);
      res.status(500).json({ error: error.message || 'Failed to generate response' });
    }
  });

  // Serve with Vite in dev, or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ReSpace KSA server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
