from typing import List
from langchain_huggingface import HuggingFaceEmbeddings

def calculate_embedding(label : str) -> List[float]:
    """
    Given a label, return the embedding for the label.
    """
    text = f"current tag: {label}"
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2").embed_query(text)