import OpenAI from "openai";
import { NextResponse } from "next/server";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not set. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  const gemini = new OpenAI({
    baseURL: GEMINI_BASE_URL,
    apiKey,
  });

  try {
    const response = await gemini.chat.completions.create({
      model: "gemini-3.1-flash-lite",
      messages: [
        {
          role: "system",
          content:
            "You share fun facts. Always pick a different topic from any previous fact. Never repeat the same animal, person, place, or object. Keep the fact to 1-3 sentences and use **bold** around the most surprising part.",
        },
        {
          role: "user",
          content: `Tell me a fun fact. Random seed: ${Date.now()}`,
        },
      ],
      temperature: 1.2,
    });
    const fact = response.choices[0]?.message?.content ?? "";
    return NextResponse.json({ fact });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to generate fact" },
      { status: 500 }
    );
  }
}