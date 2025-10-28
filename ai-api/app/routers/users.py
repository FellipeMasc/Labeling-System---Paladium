from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth import auth_required
from app.deps.database import db_pg_connection
from psycopg2.extensions import connection
from app.schemas.api_dtos import ApiTagsRequest
from typing import List
from app.deps.inference_agent import inference_agent
from app.schemas.agent_schema import TagInferenceRequest
from app.schemas.api_dtos import UpdateLikelihoodScoreRequest
from app.deps.calculate_likelihood import calculate_likelihood, calculate_cosine_similarity 
from app.deps.hugging_face_embbeding import calculate_embedding
from app.deps.database_deps import get_db_pg
router = APIRouter(tags=["users"])

        
@router.post("/infer-tags")
async def infer_tags(request: ApiTagsRequest, session: dict = Depends(auth_required), db: connection = Depends(get_db_pg))->List[str]:
    with db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""with group_tags as (
                                select g."name", g.description, t.value
                                from public.tag t
                                inner join public.image i on i."id" = %s
                                inner join public."group" g on i."groupId" = g.id 
                                where t."imageId" = %s
                            )
                            select gt."name", gt.description, array_agg(gt.value) 
                            from group_tags gt
                            group by gt."name", gt.description""", (request.image_id, request.image_id))
            group_tags = cursor.fetchone()
            group_name = group_tags[0] if group_tags is not None else None
            group_description = group_tags[1] if group_tags is not None else None
            group_tags = group_tags[2] if group_tags is not None else None
    agent = inference_agent()
    tags = agent.infer_image_tags(TagInferenceRequest(image_url=request.image_url, group_name=group_name, group_description=group_description, tags=group_tags))
    return tags

@router.post("/update-likelihood-score")
async def update_likelihood_score(request: UpdateLikelihoodScoreRequest, session: list = Depends(auth_required), db: connection = Depends(get_db_pg)):
    user_id = session[0]
    with db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT "imageId" FROM public.tag WHERE "id" = %s""", (request.tag_id,))
            image_id = cursor.fetchone()
            if image_id is None:
                raise HTTPException(status_code=404, detail="Image from Tag not found")
            image_id = image_id[0]
            cursor.execute("""SELECT "context" FROM public.image_context WHERE "imageId" = %s""", (image_id,))
            context = cursor.fetchone()
            if context is None:
                raise HTTPException(status_code=404, detail="ImageContext not found")
            context = context[0]
            
    likelihood = calculate_likelihood(context, request.label)
    with db() as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT "likelihoodScore" FROM public.user WHERE "id" = %s""", (user_id,))
            user_likelihood_score = cursor.fetchone()
            if user_likelihood_score is None:
                raise HTTPException(status_code=404, detail="User not found")
            user_likelihood_score = user_likelihood_score[0]
            # more weight to the previous likelihood score
            new_user_likelihood_score = user_likelihood_score * 0.7 + likelihood * 0.3 if user_likelihood_score != 0 else likelihood
            cursor.execute("""UPDATE public.user SET "likelihoodScore" = %s WHERE "id" = %s""", (new_user_likelihood_score, user_id))
            cursor.execute("""UPDATE public.tag SET "likelihoodScore" = %s WHERE "id" = %s""", (likelihood, request.tag_id))
    


