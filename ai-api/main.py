from fastapi import FastAPI
from app.deps.inference_agent import infer_image_tags
app = FastAPI()

@app.post("/infer-tags")
async def infer_tags(image_url: str):
    tags = await infer_image_tags(image_url)
    return {"tags": tags}
