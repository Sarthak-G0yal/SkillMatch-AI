"use client";

import { useState } from "react";

type ResumeSummary = {
  skills: string;
  experience: string[];
  education: string;
};

type Match = {
  filename: string;
  score: number;
  snippet: string;
  summary: ResumeSummary;
};

export default function MatchResults() {
  const [description, setDescription] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const form = new FormData();
      form.append("job_description", description);
      const res = await fetch("http://localhost:8000/match", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      // data.matches includes summary per match
      setMatches(data.matches || []);
      setShowResults(true);
    } catch (err) {
      console.error("Match error", err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDescription("");
    setMatches([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      {!showResults ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
            rows={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Matching..." : "Match"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Top Matches</h2>
            <button
              onClick={reset}
              className="text-sm text-blue-600 hover:underline"
            >
              ← New Match
            </button>
          </div>
          {matches.map((match, i) => (
            <div key={i} className="border rounded p-4 bg-gray-50">
              <p className="font-semibold">
                {match.filename} –{" "}
                <span className="text-blue-600">
                  {(match.score * 100).toFixed(2)}%
                </span>
              </p>
              <p className="text-sm text-gray-700 mt-1">{match.snippet}</p>
              <div className="mt-3 border-t pt-3">
                <h3 className="font-semibold">Resume Summary</h3>
                <p>
                  <strong>Skills:</strong> {match.summary.skills}
                </p>
                <div className="mt-1">
                  <strong>Experience:</strong>
                  <ul className="list-disc list-inside">
                    {match.summary.experience.map((exp, idx) => (
                      <li key={idx}>{exp}</li>
                    ))}
                  </ul>
                </div>
                <p className="mt-1">
                  <strong>Education:</strong> {match.summary.education}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
