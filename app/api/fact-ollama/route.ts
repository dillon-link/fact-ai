import OpenAI from "openai";
import { NextResponse } from "next/server";

const OLLAMA_BASE_URL = "http://localhost:11434/v1";

export async function GET() {
  const ollama = new OpenAI({
    baseURL: OLLAMA_BASE_URL,
    apiKey: "ollama",
  });

  try {
    const response = await ollama.chat.completions.create({
      model: "llama3.2",
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