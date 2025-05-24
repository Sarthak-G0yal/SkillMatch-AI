'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [resume, setResume] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !description) return;

    const formData = new FormData();
    formData.append('file', resume);
    await fetch('http://localhost:8000/upload_resume', {
      method: 'POST',
      body: formData,
    });

    const matchData = new FormData();
    matchData.append('job_description', description);
    setLoading(true);
    const response = await fetch('http://localhost:8000/match', {
      method: 'POST',
      body: matchData,
    });
    const result = await response.json();
    setMatches(result.matches || []);
    setLoading(false);
    setShowModal(true);
  };

  return (
    <div className="max-w-lg w-full mx-auto p-8 bg-white shadow border border-gray-200 rounded-xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">AI Resume Matcher</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setResume(e.target.files?.[0] || null)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
            placeholder="Paste the job description here..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Matching...' : 'Match Resume'}
        </button>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4 text-center">Top Matches</h2>
            {matches.length > 0 ? (
              matches.map((match, i) => (
                <div key={i} className="border rounded-lg p-4 mb-4 text-sm">
                  <p className="font-medium text-gray-800">{match.filename}</p>
                  <p className="text-gray-600 mt-1">Score: {(match.score * 100).toFixed(2)}%</p>
                  <p className="text-gray-500 mt-2 line-clamp-3">{match.snippet}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No matches found.</p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-sm bg-gray-100 py-2 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
