# AI Hiring Assistant - Full Stack Documentation

## Overview

The AI Hiring Assistant is a web application designed to simplify and enhance the recruitment process by:

* Parsing and embedding resumes
* Matching candidates to job descriptions using OpenAI embeddings and FAISS
* Scheduling interviews via Google Calendar API

Built using:

* **Frontend**: Next.js (with Tailwind CSS)
* **Backend**: FastAPI (Python)
* **AI**: OpenAI's embedding and chat completion APIs
* **Search**: FAISS (vector search)
* **Scheduling**: Google Calendar API

---

## Backend Structure

**Directory:** `backend/`

### Key Files & Folders

* `main.py`: Main FastAPI app with endpoints
* `models/`

  * `schemas.py`: Pydantic models (for request/response bodies)
* `services/`

  * `embeddings.py`: Embedding logic using OpenAI API
  * `faiss_index.py`: FAISS index storage and querying
  * `parser.py`: Resume text extraction from PDF/DOCX
* `storage/`

  * `faiss.index`: Persistent vector index file
* `utils/`

  * `logger.py`: Optional logging utilities

### API Endpoints

#### `POST /upload_resume`

* Accepts: PDF or DOCX file
* Extracts text, generates embedding, stores in FAISS index

#### `POST /match`

* Accepts: Job description (text)
* Returns: Top 3 matching resumes with similarity score

#### `POST /book`

* Accepts: Name, email, and interview time
* Books a calendar event in Google Calendar

---

## Frontend Structure

**Directory:** `src/`

### Pages

* `app/page.tsx`: Home page
* `app/scheduler/page.tsx`: Interview booking page

### Components

* `UploadForm.tsx`: File uploader for resumes + job description input
* `MatchResults.tsx`: Displays matching candidates
* `SchedulerForm.tsx`: Interview booking form

### Lib

* `lib/api.ts`: API calling utilities
* `lib/openai.ts`, `pinecone.ts`: (early stages - optional abstraction)

### Styling

* Tailwind CSS with Google Fonts (Geist)
* Minimal, clean design

---

## Google Calendar Integration

### Service Account

* Create a service account via Google Cloud Console
* Share your interview calendar with `client_email` from service account
* Save JSON credentials to `.env` or `google_creds.json`

### Endpoint Logic

* Loads service credentials
* Creates event with specified slot, summary, and attendee email

---

## Environment Variables

Create a `.env` file in the `backend/`:

```
OPENAI_API_KEY=your-openai-key
GOOGLE_APPLICATION_CREDENTIALS=google_creds.json
GOOGLE_CALENDAR_ID=your-calendar-id
```

---

## Future Improvements

* Pull real-time availability from Google Calendar
* Add authentication and admin dashboard
* Send confirmation emails
* Rate limiting and error handling
* Export match reports

---

## How to Run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

Backend runs at: `http://localhost:8000`
Frontend at: `http://localhost:3000`

---

## Authors

Built for Holboxathon 2025 - Problem 4: Agentic AI Hiring Assistant
