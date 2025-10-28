from typing import List
import numpy as np
from app.deps.hugging_face_embbeding import calculate_embedding

def calculate_cosine_similarity(embedding1: List[float], embedding2: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    v1 = np.array(embedding1)
    v2 = np.array(embedding2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(np.dot(v1, v2) / (norm1 * norm2))

def calculate_likelihood(embedding: List[float], label: str) -> float:
    """
    Given an embedding and a label embedding (both as lists of floats),
    compute the similarity score to be interpreted as likelihood.
    """
    label_embedding = calculate_embedding(label)
    similarity = calculate_cosine_similarity(embedding, label_embedding)
    likelihood = (similarity + 1) / 2
    return likelihood


