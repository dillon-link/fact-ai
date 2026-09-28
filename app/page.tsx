"use client";

import { useState } from "react";

export default function Home() {
  const [fact, setFact] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const generateFact = async () => {
    setLoading(true);
    setError("");
    setFact("");
    try {
      const res = await fetch("/api/fact");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to fetch fact");
      }
      const data = await res.json();
      setFact(data.fact);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
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
      <button onClick={generateFact} disabled={loading}>
        {loading ? "Thinking..." : "Tell me a fun fact"}
      </button>
      {error && <p className="error">{error}</p>}
      {fact && (
        <p className="fact">
          {parseFact(fact).map((seg, i) =>
            seg.bold ? <strong key={i}>{seg.text}</strong> : <span key={i}>{seg.text}</span>
          )}
        </p>
      )}
      {!fact && !loading && !error && (
        <p className="muted">Click the button to generate a fun fact.</p>
      )}
    </main>
  );
}