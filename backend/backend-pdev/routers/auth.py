from urllib import request
from fastapi import APIRouter, FastAPI, HTTPException, Request, Request 
from models import LoginPayload
from db import connect_db

router = APIRouter()

def ConnectUser(mail: str, password: str): 
    conn = connect_db() 
    cursor = conn.cursor(dictionary=True) 
    query = "SELECT id_user, mail, pseudo, can_edit FROM user WHERE mail = %s AND password = %s" 
    cursor.execute(query, (mail, password)) 
    result = cursor.fetchone() 
    cursor.close() 
    conn.close() 
    return result

def LogOutUser(): 
    return True 
# récup info user connecté
@router.get("/me")
def me(request: Request):
    user = request.session.get("user")
    if not user: raise HTTPException(status_code=401, detail="Not logged in")
    return user
# connection 
@router.post("/login")
def login(payload: LoginPayload, request: Request):
    user = ConnectUser(payload.mail, payload.password) 
    if not user: raise HTTPException(status_code=401, detail={"message": "Invalid credentials", "success": False}) 
    request.session["user"] = {
        "id_user": user["id_user"], 
        "mail": user["mail"], 
        "pseudo": user["pseudo"],
        "can_edit": user["can_edit"]
    }
    return {"message": "Login successful", "user": user, "success": True} 
# déconnexion 
@router.post("/logout") 
def logout(): 
    if LogOutUser(): 
        return {"message": "Logout successful", "success": True} 
    raise HTTPException(status_code=400, detail={"message": "Logout failed", "success": False})