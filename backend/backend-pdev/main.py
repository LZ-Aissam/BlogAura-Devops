from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from db import connect_db
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.posts import router as posts_router
from routers.comment import router as comment_router
from routers.react import router as react_router

app = FastAPI() 

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sessions
app.add_middleware(
    SessionMiddleware,
    secret_key="un-secret-long-et-random",
)

def LogOutUser():
    return True
# routes
@app.get("/")
def read_root():
    return {"message": "API is running", "db_status": "connected" if connect_db() else "not connected", "version": "26.15.02"}
app.include_router(auth_router, prefix="/auth") #routes pour l'authentification
app.include_router(users_router, prefix="/users") #routes pour les utilisateurs (CRUD)
app.include_router(posts_router, prefix="/posts") #routes pour les posts (CRUD)
app.include_router(comment_router, prefix="/comments") #routes pour les commentaires (CRUD)
app.include_router(react_router, prefix="/reacts") #routes pour les réactions (CRUD)