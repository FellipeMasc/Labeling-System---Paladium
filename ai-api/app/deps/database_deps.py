from app.deps.database import db_pg_connection
#this is a dependency for the database connection
def get_db_pg():
    return db_pg_connection