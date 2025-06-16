import os
from openai import OpenAI
from dotenv import load_dotenv
import json
import requests as rq
import re
from typing import Dict, List

load_dotenv()

# Getting API Key and Model
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
if os.getenv("OLLAMA_API_KEY"):
    client = os.getenv("OLLAMA_API_KEY")
    if os.getenv("OLLAMA_MODEL") is None:
        raise ("OLLAMA_MODEL is required")
    else:
        MODEL = os.getenv("OLLAMA_MODEL")


# # Generate resume summary using OpenAI
# def generate_resume_summary_open_ai(resume_text: str) -> dict:
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
#             {
#                 "role": "system",
#                 "content": "You are a helpful assistant that summarizes resumes.",
#             },
#             {"role": "user", "content": prompt},
#         ],
#         temperature=0.3,
#     )

#     content = response.choices[0].message.content.strip()

#     try:
#         return json.loads(content)
#     except Exception:
#         return {"skills": "", "experience": [], "education": ""}


def clean_thoughts(text: str) -> str:
    re_pattern = r"<think>.*?</think>"
    full_response = re.sub(re_pattern, "", text, flags=re.DOTALL)
    return full_response.strip()


def parse_structured_feedback(raw: str) -> Dict[str, List[str]]:
    def extract_section(title: str, text: str) -> List[str]:
        pattern = rf"- \*\*{title}\*\*:(.*?)(?=\n- \*\*|$)"
        match = re.search(pattern, text, re.DOTALL)
        if not match:
            return []
        section_text = match.group(1).strip()
        return [
            line.strip(" -")
            for line in section_text.strip().split("\n")
            if line.strip()
        ]

    return {
        "strengths": extract_section("Strengths", raw),
        "weaknesses": extract_section("Weaknesses", raw),
        "communication": extract_section("Communication quality", raw),
    }


def generate_resume_summary_llm(prompt: str) -> str:
    import requests

    data = {"model": MODEL, "prompt": prompt, "stream": True}

    headers = {"Content-Type": "application/json"}

    try:
        response = rq.post(client, headers=headers, data=json.dumps(data), stream=True)

        if response.status_code == 200:
            full_response = ""
            for line in response.iter_lines():
                if line:
                    try:
                        chunk = json.loads(line.decode("utf-8"))
                        full_response += chunk.get("response", "")
                        if chunk.get("done", False):
                            break
                    except json.JSONDecodeError:
                        continue
            full_response = clean_thoughts(full_response)
            return full_response.strip()
        else:
            print(f"[!] Ollama API Error {response.status_code}: {response.text}")
            return "Error: Failed to get response from model."
    except rq.exceptions.RequestException as e:
        print(f"[!] Request failed: {e}")
        return "Error: Exception occurred while calling Ollama."


def generate_gpt_summary(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You're an expert technical recruiter."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
