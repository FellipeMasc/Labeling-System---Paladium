from typing import List
# from langchain_huggingface import HuggingFaceEmbeddings
from app.deps.inference_agent import inference_agent

def calculate_embedding(label : str) -> List[float]:
    """
    Given a label, return the embedding for the label.
    """
    text = f"current tag: {label}"
    agent = inference_agent().get_client()
    return agent.embeddings.create(input=text, model="text-embedding-3-small", dimensions=1536).data[0].embedding
    # return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2").embed_query(text)