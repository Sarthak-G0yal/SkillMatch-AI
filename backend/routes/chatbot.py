# backend/routes/chatbot.py
from fastapi import APIRouter, Body
from typing import List
from pydantic import RootModel
from services.summary import generate_gpt_summary  # Reuse your summary function

# router = APIRouter()


""" 
 
    Real Function commented due to quota limit in chatgpt.

"""
# @router.post("/chatbot_feedback")
# def chatbot_feedback(answers: List[str] = Body(...)):
#     # Sample hardcoded questions to match with frontend config
#     questions = [
#         "Tell me about your most recent project and your role in it.",
#         "What programming languages are you most comfortable with?",
#         "Describe a challenging bug you faced and how you solved it.",
#         "How do you stay updated with new tech or industry trends?",
#         "Why are you interested in this role?"
#     ]

#     qa_block = "\n".join([f"Q{i+1}: {q}\nA{i+1}: {a}" for i, (q, a) in enumerate(zip(questions, answers))])

#     prompt = f"""You're a virtual recruiter. A candidate answered the following questions:
#     {qa_block}
#     Write a short summary highlighting:
#     1. Strengths
#     2. Weaknesses
#     3. Communication quality
#     Respond in bullet points."""

#     summary = generate_gpt_summary(prompt)
#     return {"summary": summary}


router = APIRouter()

class ChatbotAnswers(RootModel[List[str]]):
    pass

@router.post("/chatbot_feedback")
async def generate_chatbot_feedback(answers: ChatbotAnswers):
    # answers.__root__ contains the list of text answers
    dummy_feedback = """
📝 **Candidate Feedback Summary**

**Strengths:**
- Communicates clearly and concisely.
- Shows practical experience with recent projects.
- Demonstrates initiative in learning and debugging.
- Strong alignment with role expectations.

**Weaknesses:**
- Some answers could use more detail on technical specifics.
- Lacks depth on industry trends in one response.

✅ Overall: Promising candidate worth further review.
"""
    return {"summary": dummy_feedback}