import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.APIKEY
});

app.post("/generate", async (req: Request, res: Response) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ message: "Topic is required" });
  }

  const prompt = `
Generate 5 creative blog titles with short outlines for the topic: "${topic}".
Format:
1. Title
   - Outline
2. Title
   - Outline
...
  `;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    const result = completion.choices[0].message.content;
    res.json({ response: result });
  } catch (err) {
    console.error(err instanceof Error ? err.message : 'Unknown error');
    res.status(500).send("Error generating blog ideas");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
