import faiss
import numpy as np

DIM = 1536
index = faiss.IndexFlatL2(DIM)

def add_to_index(filename: str, vector: list[float]):
    index.add(np.array([vector]))

def search_top_k(vector: np.ndarray, k: int = 3):
    D, I = index.search(np.array([vector]), k)
    return D[0], I[0]

def get_index():
    return index
