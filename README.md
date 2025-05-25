# AI Hiring Assistant

A web application designed to simplify and enhance the recruitment process using AI.

## ✨ Features

- Upload and parse resumes
- Embed and semantically match resumes to job descriptions using OpenAI
- Retrieve top matching candidates using FAISS vector search
- Book interviews directly to Google Calendar

---

## 🧱 Tech Stack

| Layer        | Tech                                   |
|--------------|----------------------------------------|
| Frontend     | Next.js, Tailwind CSS                  |
| Backend      | FastAPI (Python)                       |
| AI           | OpenAI Embeddings, Chat Completions    |
| Search       | FAISS (Facebook AI Similarity Search)  |
| Scheduling   | Google Calendar API                    |

---

## 📁 Backend Structure

**Directory:** `backend/`

### Key Files & Folders

- `main.py`: Entry point for FastAPI app and router includes
- `models/schemas.py`: Pydantic request and response schemas
- `routes/booking.py`: Google Calendar booking logic
- `services/`
  - `embeddings.py`: Embedding resumes/job descriptions
  - `faiss_index.py`: Indexing and searching with FAISS
  - `parser.py`: Extract text from PDF/DOCX resumes
  - `google_calendar.py`: Calendar event creation logic
- `storage/faiss.index`: Persistent FAISS index file

#### `POST /upload_resume`
- **Input:** Resume file (PDF or DOCX)
- **Output:** Success status, stored embedding

#### `POST /match`
- **Input:** Job description (text)
- **Output:** Top 3 matched resumes with similarity scores

#### `POST /book`
- **Input:** Candidate name, email, and interview time
- **Output:** Google Calendar confirmation

---

## 🎨 Frontend Structure

**Directory:** `src/`

### Pages

- `app/page.tsx`: Home dashboard
- `app/upload/page.tsx`: Resume uploader and matcher
- `app/match/page.tsx`: Top candidates display
- `app/scheduler/page.tsx`: Interview booking form

### Components

- `UploadForm.tsx`: Upload form component
- `MatchResults.tsx`: Candidate result cards
- `SchedulerForm.tsx`: Form to pick and book slots

### Libraries

- `lib/api.ts`: Utility functions for API interaction
- `lib/openai.ts`, `lib/pinecone.ts`: Reserved for future modularization

---

## 🗓 Google Calendar Integration

### Setup

1. Create a **Service Account** in Google Cloud Console.
2. Share your calendar with the service account's `client_email`.
3. Save your credentials JSON file as `backend/credentials.json`.

### Environment Setup

Create `.env` file in `backend/`:

```env
OPENAI_API_KEY=your-openai-key
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
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

By: EMC / Sarthak Goyal