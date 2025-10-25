from fastapi import FastAPI, Depends, HTTPException
from app.deps.inference_agent import inference_agent
from contextlib import asynccontextmanager
from app.schemas.agent_schema import TagInferenceRequest
from app.schemas.api_dtos import ApiTagsRequest
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import List
from app.deps.database import db_pg_connection
from psycopg2.extensions import connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent
    agent = inference_agent()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("NEXT_PUBLIC_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/infer-tags")
async def infer_tags(request: ApiTagsRequest, db: connection = Depends(db_pg_connection))->List[str]:
    if request.user_id is None:
        raise HTTPException(status_code=400, detail="Usuário não encontrado")
    
    with db as conn:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM public.user WHERE id = %s", (request.user_id,))
            user = cursor.fetchone()
            if user is None:
                raise HTTPException(status_code=404, detail="Usuário não autenticado")
            
    tags = agent.infer_image_tags(TagInferenceRequest(image_url=request.image_url))
    return tags
