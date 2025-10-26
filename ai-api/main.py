from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.routers import users
from app.routers import admins


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("NEXT_PUBLIC_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/users")
app.include_router(admins.router, prefix="/admins")
