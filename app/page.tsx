"use client";

import { useState } from "react";

export default function Home() {
  const [geminiFact, setGeminiFact] = useState<string>("");
  const [ollamaFact, setOllamaFact] = useState<string>("");
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [ollamaLoading, setOllamaLoading] = useState(false);
  const [geminiError, setGeminiError] = useState<string>("");
  const [ollamaError, setOllamaError] = useState<string>("");

  const generateGeminiFact = async () => {
    setGeminiLoading(true);
    setGeminiError("");
    setGeminiFact("");
    try {
      const res = await fetch("/api/fact");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch fact");
      }
      const data = await res.json();
      setGeminiFact(data.fact);
    } catch (err) {
      setGeminiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGeminiLoading(false);
    }
  };

  const generateOllamaFact = async () => {
    setOllamaLoading(true);
    setOllamaError("");
    setOllamaFact("");
    try {
      const res = await fetch("/api/fact-ollama");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch fact");
      }
      const data = await res.json();
      setOllamaFact(data.fact);
    } catch (err) {
      setOllamaError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setOllamaLoading(false);
    }
  };

  // Convert markdown bold (**text**) into <strong>text</strong>
  // and split on those segments for safe rendering without dangerouslySetInnerHTML.
  type Segment = { text: string; bold: boolean };
  const parseFact = (raw: string): Segment[] => {
    const segments: Segment[] = [];
    const regex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(raw)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ text: raw.slice(lastIndex, match.index), bold: false });
      }
      segments.push({ text: match[1], bold: true });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < raw.length) {
      segments.push({ text: raw.slice(lastIndex), bold: false });
    }
    return segments;
  };

  return (
    <main className="container">
      <h1>Fun Fact</h1>

      <div className="row">
        <section>
          <button onClick={generateGeminiFact} disabled={geminiLoading}>
            {geminiLoading ? "Thinking..." : "Gemini"}
          </button>
          {geminiError && <p className="error">{geminiError}</p>}
          {geminiFact && (
            <p className="fact">
              {parseFact(geminiFact).map((seg, i) =>
                seg.bold ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>
              )}
            </p>
          )}
          {!geminiFact && !geminiLoading && !geminiError && (
            <p className="muted">Powered by Google Gemini</p>
          )}
        </section>

        <section>
          <button onClick={generateOllamaFact} disabled={ollamaLoading}>
            {ollamaLoading ? "Thinking..." : "Ollama (Local)"}
          </button>
          {ollamaError && <p className="error">{ollamaError}</p>}
          {ollamaFact && (
            <p className="fact">
              {parseFact(ollamaFact).map((seg, i) =>
                seg.bold ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>
              )}
            </p>
          )}
          {!ollamaFact && !ollamaLoading && !ollamaError && (
            <p className="muted">Powered by Ollama (localhost)</p>
          )}
        </section>
      </div>
    </main>
  );
}