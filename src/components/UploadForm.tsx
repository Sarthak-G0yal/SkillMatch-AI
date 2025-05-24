// // 'use client';

// // import { useState } from 'react';

// // export default function UploadForm() {
// //   const [file, setFile] = useState<File | null>(null);
// //   const [parsedText, setParsedText] = useState<string>('');
// //   const [loading, setLoading] = useState(false);
// //   const [jobDesc, setJobDesc] = useState('');
// //   const [similarity, setSimilarity] = useState<number | null>(null);

// //   const BACKEND_URL = 'http://localhost:8000'; // Change this if you deploy

// //   async function handleUpload(e: React.FormEvent) {
// //     e.preventDefault();
// //     if (!file) return;
// //     setLoading(true);

// //     const formData = new FormData();
// //     formData.append('file', file);

// //     const res = await fetch(`${BACKEND_URL}/upload`, {
// //       method: 'POST',
// //       body: formData,
// //     });

// //     const data = await res.json();
// //     setParsedText(data.text || data.error);
// //     setLoading(false);
// //   }

// //   async function handleCompare() {
// //     const formData = new FormData();
// //     formData.append('resume', new Blob([parsedText], { type: 'text/plain' }));
// //     formData.append('job_description', new Blob([jobDesc], { type: 'text/plain' }));

// //     const res = await fetch(`${BACKEND_URL}/compare`, {
// //       method: 'POST',
// //       body: formData,
// //     });

// //     if (!res.ok) {
// //       console.error("Server error:", res.status, res.statusText);
// //       return;
// //     }

// //     const data = await res.json();
// //     setSimilarity(data.similarity);
// //   }

// //   return (
// //     <div className="space-y-4">
// //       <form onSubmit={handleUpload} className="space-y-4">
// //         <input
// //           type="file"
// //           accept=".pdf,.docx"
// //           onChange={(e) => setFile(e.target.files?.[0] ?? null)}
// //         />
// //         <button
// //           type="submit"
// //           disabled={!file || loading}
// //           className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
// //         >
// //           {loading ? 'Parsing…' : 'Upload & Parse'}
// //         </button>
// //       </form>

// //       <div className="space-y-4">
// //         <textarea
// //           rows={6}
// //           placeholder="Paste job description here..."
// //           value={jobDesc}
// //           onChange={(e) => setJobDesc(e.target.value)}
// //           className="w-full p-2 border rounded"
// //         />
// //         <button
// //           onClick={handleCompare}
// //           disabled={!parsedText || !jobDesc}
// //           className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
// //         >
// //           Match Resume to Job Description
// //         </button>
// //       </div>

// //       {similarity !== null && (
// //         <div className="mt-4 text-lg">
// //           Match Score: <strong>{(similarity * 100).toFixed(2)}%</strong> –{' '}
// //           <span className={similarity > 0.75 ? 'text-green-600' : similarity > 0.5 ? 'text-yellow-600' : 'text-red-600'}>
// //             {similarity > 0.75 ? 'Strong Match' : similarity > 0.5 ? 'Moderate Match' : 'Weak Match'}
// //           </span>
// //         </div>
// //       )}

// //       {parsedText && (
// //         <div>
// //           <h2 className="text-xl font-semibold">Parsed Text:</h2>
// //           <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
// //             {parsedText}
// //           </pre>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// 'use client';

// import { useState } from 'react';

// export default function UploadForm() {
//   const [file, setFile] = useState<File | null>(null);
//   const [parsedText, setParsedText] = useState<string>('');
//   const [loading, setLoading] = useState(false);
//   const [jobDesc, setJobDesc] = useState('');
//   const [similarity, setSimilarity] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   async function handleUpload(e: React.FormEvent) {
//     e.preventDefault();
//     if (!file) return;

//     setLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const res = await fetch('http://localhost:8000/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (data.error) {
//         setError(data.error);
//         setParsedText('');
//       } else {
//         setParsedText(data.text);
//       }
//     } catch (err) {
//       setError('Upload failed.');
//     }

//     setLoading(false);
//   }

//   async function handleCompare() {
//     setError(null);

//     const formData = new FormData();
//     formData.append('resume', new Blob([parsedText], { type: 'text/plain' }));
//     formData.append('job_description', new Blob([jobDesc], { type: 'text/plain' }));

//     try {
//       const res = await fetch('http://localhost:8000/compare', {
//         method: 'POST',
//         body: formData,
//       });

//       const text = await res.text();

//       try {
//         const data = JSON.parse(text);
//         if (data.similarity !== undefined) {
//           setSimilarity(data.similarity);
//         } else {
//           setError(data.error || 'Invalid response');
//         }
//       } catch (err) {
//         setError('Invalid JSON response from backend.');
//         console.error('Raw backend response:', text);
//       }
//     } catch (err) {
//       setError('Comparison failed.');
//     }
//   }

//   return (
//     <div className="space-y-4 max-w-2xl mx-auto">
//       <form onSubmit={handleUpload} className="space-y-4">
//         <input
//           type="file"
//           accept=".pdf,.docx"
//           onChange={(e) => setFile(e.target.files?.[0] ?? null)}
//         />
//         <button
//           type="submit"
//           disabled={!file || loading}
//           className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//         >
//           {loading ? 'Parsing…' : 'Upload & Parse'}
//         </button>
//       </form>

//       <textarea
//         rows={6}
//         placeholder="Paste job description here..."
//         value={jobDesc}
//         onChange={(e) => setJobDesc(e.target.value)}
//         className="w-full p-2 border rounded"
//       />

//       <button
//         onClick={handleCompare}
//         disabled={!parsedText || !jobDesc}
//         className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
//       >
//         Match Resume to Job Description
//       </button>

//       {similarity !== null && (
//         <div className="mt-4 text-lg">
//           Match Score:{' '}
//           <strong>{(similarity * 100).toFixed(2)}%</strong> –{' '}
//           <span className={similarity > 0.75 ? 'text-green-600' : similarity > 0.5 ? 'text-yellow-600' : 'text-red-600'}>
//             {similarity > 0.75
//               ? 'Strong Match'
//               : similarity > 0.5
//               ? 'Moderate Match'
//               : 'Weak Match'}
//           </span>
//         </div>
//       )}

//       {parsedText && (
//         <div>
//           <h2 className="text-xl font-semibold">Parsed Resume Text:</h2>
//           <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
//             {parsedText}
//           </pre>
//         </div>
//       )}

//       {error && (
//         <div className="text-red-600 font-medium mt-4">
//           Error: {error}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState } from "react";
import { uploadResume, matchJobDescription } from "@/lib/api";

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    for (const file of files) {
      await uploadResume(file);
    }
    const result = await matchJobDescription(jobDescription);
    setMatches(result.matches || []);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">Upload Resumes</h1>
      <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      <textarea
        placeholder="Paste Job Description"
        className="w-full mt-4 p-2 border rounded"
        rows={6}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
      >
        Match Candidates
      </button>

      {loading && <p className="mt-4">Matching in progress...</p>}

      {matches.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Top Matches</h2>
          {matches.map((match, i) => (
            <div key={i} className="border p-2 rounded mb-2">
              <p><strong>Filename:</strong> {match.filename}</p>
              <p><strong>Score:</strong> {match.score.toFixed(3)}</p>
              <p className="text-sm mt-1">{match.snippet}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
