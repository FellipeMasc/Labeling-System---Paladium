from fastapi import APIRouter, Depends, HTTPException
from app.deps.auth import admin_auth_required
from app.deps.database import get_db_connection
from psycopg2.extensions import connection
from app.schemas.api_dtos import AutoUsersAssignRequest
from cuid2 import cuid_wrapper

router = APIRouter(tags=["admins"])

@router.post("/auto-users-assign")
async def auto_users_assign(request: AutoUsersAssignRequest, session: dict = Depends(admin_auth_required), db: connection = Depends(get_db_connection)):
    #this threshold could be calculated based on the number of images in the group and the number of users in the group
    threshold = 1
    try:
        with db as conn:
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