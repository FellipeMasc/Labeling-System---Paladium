from fastapi import FastAPI
from app.deps.inference_agent import inference_agent
from contextlib import asynccontextmanager
from app.schemas.agent_schema import TagInferenceRequest


@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent
    agent = inference_agent()
    yield
    

app = FastAPI(lifespan=lifespan)

@app.post("/infer-tags")
async def infer_tags(image_url: str):
    tags = agent.infer_image_tags(TagInferenceRequest(image_url=image_url))
    return tags
