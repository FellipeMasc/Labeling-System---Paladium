from fastapi import Depends, HTTPException, status, Request
from app.deps.database import db_pg_connection
from psycopg2.extensions import connection

async def get_current_session(request: Request, db: connection = Depends(db_pg_connection)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = auth_header.removeprefix("Bearer ").strip()
    
    with db as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT * FROM public.session inner join public.user on public.session."userId" = public.user."id" WHERE "token" = %s""", (token,))
            session = cursor.fetchone()
            if session is None:
                raise HTTPException(status_code=404, detail="Session not found")
            
async def get_current_admin_session(request: Request, db: connection = Depends(db_pg_connection)):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = auth_header.removeprefix("Bearer ").strip()
    
    with db as conn:
        with conn.cursor() as cursor:
            cursor.execute("""SELECT * FROM public.session inner join public.user on public.session."userId" = public.user."id" WHERE "token" = %s and public.user."admin" = true""", (token,))
            session = cursor.fetchone()
            if session is None:
                raise HTTPException(status_code=404, detail="Session not found")
    return session

def auth_required(session: dict = Depends(get_current_session)):
    return session

def admin_auth_required(session: dict = Depends(get_current_admin_session)):
    return session