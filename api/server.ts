import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Validate reminder text
app.post('/api/validate', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // TODO: Add validation logic
    return res.json({ valid: true });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// Duckling endpoint (to be implemented)
app.post('/api/parse', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // TODO: Implement Duckling API integration
    return res.json({
      title: text,
      date: new Date().toISOString(),
      recurring: false,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

// OpenAI endpoint
app.post('/api/nlp', async (req: Request, res: Response) => {
  try {
    if (!openai) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "Extract date, time, and reminder information from the following text. Respond in JSON format with fields: date, time, description."
        },
        {
          role: "user",
          content: text
        }
      ],
      model: "gpt-3.5-turbo",
    });

    return res.json({ 
      response: completion.choices[0]?.message?.content,
      usage: completion.usage
    });
  } catch (error) {
    return res.status(500).json({ error: 'OpenAI API error' });
  }
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
