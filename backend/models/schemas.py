from pydantic import BaseModel


class MatchResult(BaseModel):
    filename: str
    score: float
    snippet: str
