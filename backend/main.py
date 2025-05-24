from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
from docx import Document
import PyPDF2
import os
import re
import json
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app = FastAPI()

# Enable CORS for development (allow frontend on localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_file(uploaded_file: UploadFile) -> str:
    if uploaded_file.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(uploaded_file.file)
        return "\n".join(page.extract_text() for page in reader.pages if page.extract_text())
    elif uploaded_file.filename.endswith(".docx"):
        contents = uploaded_file.file.read()
        doc = Document(io.BytesIO(contents))
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        return "Unsupported file format"

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        text = extract_text_from_file(file)
        return {"text": text}
    except Exception as e:
        return {"error": str(e)}

@app.post("/compare")
async def compare_resumes(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...)
):
    try:
        resume_text = (await resume.read()).decode("utf-8")
        job_text = (await job_description.read()).decode("utf-8")

        prompt = f"""
Compare the following resume and job description. Give a match score between 0 and 1.

Resume:
{resume_text}

Job Description:
{job_text}

Respond with only a JSON object like this: {{"similarity": <score>}}
"""

        response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.2
)

        content = response.choices[0].message['content']

        # Print raw content from OpenAI to console
        print("\n--- RAW OpenAI Response ---")
        print(content)
        print("--- END RESPONSE ---\n")

        # Extract JSON object safely
        match = re.search(r'\{[^{}]*"similarity"[^{}]*\}', content)
        if match:
            return json.loads(match.group(0))
        else:
            return {"error": "Invalid response from OpenAI", "raw": content}

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
