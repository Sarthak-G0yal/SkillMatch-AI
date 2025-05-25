import os
from openai import OpenAI
from dotenv import load_dotenv
import json

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# def generate_resume_summary(resume_text: str) -> dict:
#     prompt = f"""
# You are an expert hiring assistant. Read the following resume text and extract:

# - Key Skills (as a comma-separated list)
# - Relevant Experience (concise 2-3 bullet points)
# - Education (key degrees or certifications)

# Resume:
# \"\"\"
# {resume_text}
# \"\"\"

# Respond ONLY in this JSON format:
# {{
#   "skills": "...",
#   "experience": ["..."],
#   "education": "..."
# }}
#     """

#     response = client.chat.completions.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system", "content": "You are a helpful assistant that summarizes resumes."},
#             {"role": "user", "content": prompt}
#         ],
#         temperature=0.3
#     )

#     content = response.choices[0].message.content.strip()

#     try:
#         return json.loads(content)
#     except Exception:
#         # fallback if GPT response is not valid JSON
#         return {"skills": "", "experience": [], "education": ""}

def generate_resume_summary(resume_text: str) -> dict:
    # Simulated static summary response for testing
    return {
        "skills": "Python, Machine Learning, Data Analysis, FastAPI, React",
        "experience": [
            "Developed and deployed ML models for resume parsing.",
            "Led a team to build a scalable hiring assistant web app.",
            "Integrated OpenAI and Google Calendar APIs for smart scheduling."
        ],
        "education": "B.Tech in Computer Science, XYZ University"
    }

def generate_gpt_summary(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "You're an expert technical recruiter."},
                  {"role": "user", "content": prompt}],
        temperature=0.7
    )
    return response.choices[0].message.content.strip()