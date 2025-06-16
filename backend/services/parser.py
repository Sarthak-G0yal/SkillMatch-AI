import io
from docx import Document
import PyPDF2


def extract_text_from_file(file_path: str) -> str:
    if file_path.endswith(".pdf"):
        with open(file_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            return "\n".join(
                [page.extract_text() for page in reader.pages if page.extract_text()]
            )
    elif file_path.endswith(".docx"):
        with open(file_path, "rb") as f:
            doc = Document(io.BytesIO(f.read()))
            return "\n".join([p.text for p in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format")
