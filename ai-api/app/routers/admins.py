from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth import admin_auth_required
from app.deps.database import get_db_connection
from psycopg2.extensions import connection
from app.schemas.api_dtos import AutoUsersAssignRequest, UpdateLikelihoodScoreRequest
from cuid2 import cuid_wrapper
from app.deps.inference_agent import inference_agent
from app.deps.calculate_likelihood import calculate_likelihood
from app.deps.database_deps import get_db_pg
router = APIRouter(tags=["admins"])

@router.post("/auto-users-assign")
async def auto_users_assign(request: AutoUsersAssignRequest, session: dict = Depends(admin_auth_required), db: connection = Depends(get_db_pg)):
    #this threshold could be calculated based on the number of images in the group and the number of users in the group, i.e could scale based on the workload
    threshold = 1
    try:
        with db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""with available_users as (
                                select u.id as "userId", u."likelihoodScore", count(t.id) as count 
                                from public."user" u 
								inner join public.tag t on t."createdById" = u.id
								group by u.id, u."likelihoodScore"
							) 
							select au."userId"
							from available_users au
							order by au."count" asc, au."likelihoodScore" desc
							limit %s""", (threshold,))
                users = cursor.fetchall()
                for user in users:
                    group_member_id = cuid_wrapper()()
                    cursor.execute("""INSERT INTO public.group_member ("id","userId", "groupId") VALUES (%s, %s, %s)""", (group_member_id,user[0], request.group_id))
                return {"message": "Users assigned successfully"}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.post("/update-likelihood-score")
async def update_likelihood_score(request: UpdateLikelihoodScoreRequest, session: dict = Depends(admin_auth_required), db: connection = Depends(get_db_pg)):
    try:
        with db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""with admin_tags as ( 
                                select *
                                from public.tag t 
                                where t."imageId" = (select "imageId" from public.tag where id = %s) and t."source" = 'ADMIN'
                            ) 
                            select at."imageId", i.url, array_agg(at."value") 
                            from admin_tags at
                            inner join image i on i.id = at."imageId"
                            group by at."imageId", i.url""", (request.tag_id,))
                image_info = cursor.fetchone()
                image_id = image_info[0]
                if image_id is None:
                    raise HTTPException(status_code=404, detail="Image from Tag not found")
                image_url = image_info[1] if image_info is not None else None
                labels = image_info[2] if image_info is not None else None
        agent = inference_agent()
        embedding = agent.create_embedding(image_url, labels)
        with db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""SELECT * FROM public.image_context WHERE "imageId" = %s""", (image_id,))
                image_context = cursor.fetchone()
                if image_context is None:
                    cursor.execute("""INSERT INTO public.image_context ("id", "imageId", "context") VALUES (%s, %s, %s)""", (cuid_wrapper()(), image_id, embedding))
                else:
                    cursor.execute("""UPDATE public.image_context SET "context" = %s WHERE "imageId" = %s""", (embedding, image_id))
                
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
    