from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import List
# from services.summary import generate_gpt_summary  # Uncomment when GPT quota is restored

router = APIRouter()

class ChatbotAnswers(BaseModel):
    answers: List[str]

@router.post("/chatbot_feedback")
async def generate_chatbot_feedback(answers: ChatbotAnswers):
    questions = [
        "Tell me about your most recent project and your role in it.",
        "What programming languages are you most comfortable with?",
        "Describe a challenging bug you faced and how you solved it.",
        "How do you stay updated with new tech or industry trends?",
        "Why are you interested in this role?"
    ]
    qa_block = "\n".join([
        f"Q{i+1}: {q}\nA{i+1}: {a}"
        for i, (q, a) in enumerate(zip(questions, answers.__root__))
    ])

    prompt = f"""
    You're a virtual recruiter. A candidate answered the following questions:
    {qa_block}

    Write a short summary highlighting:
    1. Strengths
    2. Weaknesses
    3. Communication quality

    Respond in bullet points.
    """

    summary = generate_gpt_summary(prompt)
    return {"summary": summary}