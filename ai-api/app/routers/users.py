from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth import auth_required
from app.deps.database import db_pg_connection
from psycopg2.extensions import connection
from app.schemas.api_dtos import ApiTagsRequest
from typing import List
from app.deps.inference_agent import inference_agent
from app.schemas.agent_schema import TagInferenceRequest
from app.schemas.api_dtos import AutoUsersAssignRequest
router = APIRouter(tags=["users"])

        
@router.post("/infer-tags")
async def infer_tags(request: ApiTagsRequest, session: dict = Depends(auth_required), db: connection = Depends(db_pg_connection))->List[str]:
    agent = inference_agent()
    tags = agent.infer_image_tags(TagInferenceRequest(image_url=request.image_url))
    return tags