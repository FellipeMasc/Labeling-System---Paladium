import os
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
from psycopg2 import pool, OperationalError
from psycopg2.pool import PoolError
from contextlib import contextmanager
import urllib.parse

load_dotenv()

postgres_host: str = os.getenv("DB_HOST")
postgres_port: int = int(os.getenv("DB_PORT"))
postgres_dbname: str = os.getenv("DB_NAME")
postgres_user: str = os.getenv("DB_USER")
postgres_password: str = urllib.parse.unquote(os.getenv("DB_PASSWORD"))
postgres_maxconn: str = os.getenv("DB_MAXCONN", "20")
postgres_schema: str = os.getenv("DB_SCHEMA", "public")
db_pg_pool = None


def initialize_db_pool():
    global db_pg_pool
    try:
        db_pg_pool = pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=int(postgres_maxconn),
            host=postgres_host,
            port=postgres_port,
            database=postgres_dbname,
            user=postgres_user,
            password=postgres_password,
            options=f"-c search_path={postgres_schema}",
        )
        print("Pool de conexões com PostgreSQL criado com sucesso")
    except OperationalError as e:
        print(f"Erro ao criar pool de conexões com PostgreSQL: {str(e)}")
        raise e


@contextmanager
def db_pg_connection():
    conn = get_db_connection()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        release_db_connection(conn)


def get_db_connection():
    global db_pg_pool
    try:
        if db_pg_pool is None:
            initialize_db_pool()

        conn = db_pg_pool.getconn()
        if conn.closed != 0:
            db_pg_pool.putconn(conn, close=True)
            conn = db_pg_pool.getconn()

        return conn
    except (OperationalError, PoolError) as e:
        print(f"Erro ao obter conexão do pool: {str(e)}")
        reset_connection_pool()
        raise e


def release_db_connection(conn):
    if conn and conn.closed == 0:
        db_pg_pool.putconn(conn)
    else:
        db_pg_pool.putconn(conn, close=True)


def reset_connection_pool():
    global db_pg_pool
    try:
        if db_pg_pool:
            db_pg_pool.closeall()
        initialize_db_pool()
        print("Pool de conexões PostgreSQL reinicializado com sucesso")
    except OperationalError as e:
        print(f"Erro ao reinicializar o pool de conexões: {str(e)}")


def init_postgres():
    if not db_pg_pool:
        initialize_db_pool()


init_postgres()
