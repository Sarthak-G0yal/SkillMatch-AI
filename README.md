# SkillMatch AI

A **tool-using AI agent** that autonomously handles key recruitment tasks: it “perceives” (parses resumes), “reasons” (embeds and semantically matches them), and “acts” (books interviews via Google Calendar). By chaining these capabilities, it behaves like a specialized recruiting assistant that you can query with natural inputs.

---

## 🚀 How It Works

1. **Resume Ingestion**  
   - **Bulk Upload**: Drag-and-drop or select multiple `.pdf`/`.docx` resumes.  
   - **Parsing**: Extracts text from each document.  
   - **Embedding & Indexing**: Converts text into vectors via OpenAI embeddings and stores them in FAISS for fast similarity search.

2. **Job Matching**  
   - **Text Input**: Paste the job description into a form.  
   - **Semantic Search**: Embeds the description, retrieves top-K similar resume vectors from FAISS.  
   - **AI Summary**: For each match, the agent generates a structured summary (Skills, Experience, Education) using GPT-3.5-turbo (or a dummy fallback during development).

3. **Interview Scheduling**  
   - **Slot Selection**: Pick from available interview times.  
   - **Calendar Integration**: Automatically creates a Google Calendar event via a service-account “action” on your primary calendar.

---

## ✨ Features

- **Bulk Resume Upload** (`POST /upload_bulk`)  
- **Single-file Upload** (`POST /upload_resume`)  
- **Semantic Matching** (`POST /match`) with:
  - Top-3 candidate retrieval  
  - AI-generated **Skills / Experience / Education** summaries  
- **Interview Scheduler** (`POST /book`) via Google Calendar API  
- **Modular, Extensible Architecture** ready for:
  - Real-time availability (FreeBusy API)  
  - Email notifications  
  - Admin dashboards  

---

## 🧱 Tech Stack

| Layer        | Technology                             |
|--------------|----------------------------------------|
| **Frontend** | Next.js (App Router), Tailwind CSS     |
| **Backend**  | FastAPI (Python), Uvicorn              |
| **AI**       | OpenAI Embeddings & Chat Completions   |
| **Search**   | FAISS (vector similarity search)       |
| **Calendar** | Google Calendar API (service account)  |

---

## 📂 Project Structure

```

.
├── backend/
│   ├── main.py               # FastAPI entrypoint
│   ├── routes/               # upload\_bulk, upload\_resume, booking
│   ├── services/             # parser, embeddings, faiss\_index, summary, google\_calendar, store
│   ├── storage/              # faiss.index
│   └── credentials.json      # Google service account key
└── frontend/
  └── src/
    ├── app/                  # Next.js App Router pages
    │   ├── page.tsx          # Home
    │   ├── upload/page.tsx   # Bulk uploader
    │   ├── match/page.tsx    # Job matching UI
    │   └── scheduler/page.tsx# Interview scheduler UI
    ├── components/           # UploadForm.tsx, MatchResults.tsx, SchedulerForm.tsx
    └── lib/api.ts            # Frontend API wrappers

```

---

## 📑 API Reference

### 1. **Bulk Resume Upload**  
`POST /upload_bulk`  
- **Form-data**: `files: File[]`  
- **Response**: `{ status: "success", uploaded: <count> }`

### 2. **Single Resume Upload**  
`POST /upload_resume`  
- **Form-data**: `file: File`  
- **Response**: `{ message: "Resume uploaded and indexed successfully." }`

### 3. **Job Matching & Summaries**  
`POST /match`  
- **Form-data**: `job_description: string`  
- **Response**:
  ```json
  {
    "matches": [
      {
        "filename": "alice_resume.pdf",
        "score": 0.87,
        "snippet": "Alice has 5 years of ...",
        "summary": {
          "skills": "Python, FastAPI, React",
          "experience": ["Built REST APIs", "Led a frontend team"],
          "education": "M.Sc. Computer Science"
        }
      },
      …  
    ]
  }


### 4. **Interview Booking**

`POST /book`

* **JSON**: `{ name: string, email: string, slot: string (ISO) }`
* **Response**: `{ message: "Interview booked for …", event_link: "<Google Calendar URL>" }`

---

### 📬 5. **Chatbot Pre-Screening**

This feature simulates a pre-interview chatbot that asks candidates a fixed set of screening questions.

#### Functionality

* Prompts the candidate with five screening questions.
* Accepts free-form answers.
* After submission, it returns:

  * A strengths summary
  * A weaknesses summary
* Designed for future scoring & PDF export integration.

---

## ⚙️ Environment & Setup

Create a `.env` in `backend/`:

```ini
OPENAI_API_KEY=your-openai-key
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
GOOGLE_CALENDAR_ID=primary
```

Install & run:

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd ..
npm install
npm run dev
```

* **Backend** → `http://localhost:8000`
* **Frontend** → `http://localhost:3000`

---

## 🔮 Roadmap

* Real-time slot availability
* Email confirmations & reminders
* Authentication & role-based access
* Export matches to CSV/PDF
* Analytics dashboard

---
## 🐳 Dockerization

   To simplify local development and deployment, we provide Dockerfiles and a Docker-Compose setup:

   1. **Backend** (`backend/Dockerfile`)
   2. **Frontend** (`frontend/Dockerfile`)
   3. **docker-compose.yml** at the project root

   Follow these steps:
   ```bash
   # Build & start both services
   docker-compose build
   docker-compose up
   ```
```
   * Frontend → [http://localhost:3000](http://localhost:3000)
   * Backend  → [http://localhost:8000](http://localhost:8000)

   ```
   ## 🔮 Future Improvements

   - **Real-Time Availability**  
     Use Google Calendar’s Free/Busy API to fetch actual open slots and prevent double-booking.

   - **Email Notifications & Reminders**  
     Send candidates confirmation emails on booking and reminders shortly before their interview.

   - **Authentication & Role-Based Access**  
     Integrate NextAuth (or similar) to secure routes and differentiate Recruiter/Hiring Manager/Candidate roles.

   - **Export & Reporting**  
     Offer CSV/PDF exports of match results, summaries, and schedules for offline review or audit.

   - **Interactive Analytics Dashboard**  
     Chart hiring metrics—uploads per day, average match scores, time-to-hire—to surface actionable insights.

   - **Multi-Language & Localization**  
     Extend parsing and matching to multiple languages for global talent pools.

   - **Drag-and-Drop & Batch Actions**  
     Upgrade the UI with drag-and-drop bulk upload, mass-delete, and batch export.

   - **Model Fine-Tuning & A/B Testing**  
     Experiment with fine-tuned embedding/summarization models and measure improvements in candidate relevance.

## 📜 Authors

**Holboxathon 2025 – Problem 4: Agentic AI Hiring Assistant**</br>
By EMC / Sarthak Goyal