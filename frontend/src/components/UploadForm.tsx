"use client";

import { useState } from "react";

export default function UploadForm() {
  const [resumes, setResumes] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumes || resumes.length === 0) return;

    const formData = new FormData();
    Array.from(resumes).forEach((file) => {
      formData.append("files", file);
    });

    setUploading(true);
    setMessage(null);

    const res = await fetch("http://localhost:8000/upload_bulk", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setUploading(false);

    if (res.ok) {
      setMessage(`Successfully uploaded ${resumes.length} resumes.`);
    } else {
      setMessage(`Upload failed: ${result.detail || "Unknown error"}`);
    }

    setResumes(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">
        Bulk Resume Upload
      </h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          multiple
          accept=".pdf,.docx"
          onChange={(e) => setResumes(e.target.files)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {uploading ? "Uploading..." : "Upload Resumes"}
        </button>
      </form>
      {message && (
        <p className="text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
