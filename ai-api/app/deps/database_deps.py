from app.deps.database import db_pg_connection

def get_db_pg():
    return db_pg_connection