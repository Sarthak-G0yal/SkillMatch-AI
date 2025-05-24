import io
from docx import Document
import PyPDF2
from fastapi import UploadFile

def extract_text_from_file(file: UploadFile) -> str:
    if file.filename.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file.file)
        return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
    elif file.filename.endswith(".docx"):
        contents = file.file.read()
        doc = Document(io.BytesIO(contents))
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format")
