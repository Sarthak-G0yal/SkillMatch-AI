import numpy as np
from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path

# Locate the .env file in a parent directory
env_path = Path(__file__).resolve().parents[1] / ".env"  # adjust [1] as needed

# Load environment variables from that file
load_dotenv(dotenv_path=env_path)


client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def get_embedding(text: str) -> np.ndarray:
    response = client.embeddings.create(
        model="text-embedding-3-small", input=[text.replace("\n", " ")]
    )
    return np.array(response.data[0].embedding, dtype=np.float32)
