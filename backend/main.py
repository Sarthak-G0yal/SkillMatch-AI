from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from services.parser import extract_text_from_file
from services.embeddings import get_embedding
from services.faiss_index import add_to_index, search_top_k

resume_texts = []
resume_vectors = []
resume_files = []

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    text = extract_text_from_file(file)
    vector = get_embedding(text)

    resume_texts.append(text)
    resume_vectors.append(vector)
    resume_files.append(file.filename)
    add_to_index(vector)

    return {"message": "Resume uploaded and indexed successfully."}

@app.post("/match")
async def match_job_description(job_description: str = Form(...)):
    if not resume_vectors:
        return {"error": "No resumes uploaded yet."}
    job_vector = get_embedding(job_description)
    D, I = search_top_k(job_vector, k=min(3, len(resume_vectors)))

    results = []
    for score, idx in zip(D, I):
        results.append({
            "filename": resume_files[idx],
            "score": float(1 / (1 + score)),
            "snippet": resume_texts[idx][:300]
        })

    return {"matches": results}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
