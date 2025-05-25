from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from services.parser import extract_text_from_file
from services.embeddings import get_embedding
from services.faiss_index import add_to_index, search_top_k
from services.google_calendar import create_event
from services.summary import generate_resume_summary  # ✅ NEW
from pydantic import BaseModel
from routes import booking, upload  # add 'upload'
from services.store import resume_texts, resume_vectors, resume_files
from routes import chatbot  




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(booking.router)
app.include_router(upload.router) 
app.include_router(chatbot.router)

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
        text = resume_texts[idx]
        summary = generate_resume_summary(text)  # ✅ Call GPT-4 summary
        results.append({
            "filename": resume_files[idx],
            "score": float(1 / (1 + score)),
            "text": text,
            "summary": summary
        })

    return {"matches": results}

class BookingRequest(BaseModel):
    name: str
    slot: str

@app.post("/book")
async def book_interview(data: BookingRequest):
    try:
        event_link = create_event(data.name, data.slot)
        return {"message": f"Interview booked for {data.name}", "event_link": event_link}
    except Exception as e:
        import traceback
        return {"error": str(e), "trace": traceback.format_exc()}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
