from fastapi import APIRouter, UploadFile, File
from typing import List
import os

from services.parser import extract_text_from_file
from services.embeddings import get_embedding
from services.faiss_index import add_to_index
from services.store import resume_texts, resume_vectors, resume_files

router = APIRouter()

@router.post("/upload_bulk")
async def upload_bulk(files: List[UploadFile] = File(...)):
    uploaded = 0
    for file in files:
        contents = await file.read()
        filename = file.filename

        # Save to disk (or cloud storage)
        save_path = os.path.join("storage", filename)
        with open(save_path, "wb") as f:
            f.write(contents)

        text = extract_text_from_file(save_path)
        vector = get_embedding(text)
        add_to_index(filename, vector)
        # keep in-memory store in sync with index
        resume_texts.append(text)
        resume_vectors.append(vector)
        resume_files.append(filename)

        uploaded += 1

    return {"status": "success", "uploaded": uploaded}
