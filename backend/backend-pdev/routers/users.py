from db import connect_db 
from fastapi import APIRouter, HTTPException, Request 
from models import UserUpdate, UserCreate 

router = APIRouter() 
# récupérer tout les utilisateurs 
def get_all_users(): 
    conn = connect_db() 
    cursor = conn.cursor(dictionary=True) 
    query = "SELECT id_user, mail, pseudo, can_edit FROM user" 
    cursor.execute(query) 
    result = cursor.fetchall() 
    cursor.close() 
    conn.close() 
    return result 
# récupérer un utilisateur par son id 
def get_user_by_id(user_id: int): 
    conn = connect_db() 
    cursor = conn.cursor(dictionary=True) 
    query = "SELECT id_user, mail, pseudo, can_edit FROM user WHERE id_user = %s" 
    cursor.execute(query, (user_id,)) 
    result = cursor.fetchone() 
    cursor.close() 
    conn.close() 
    return result 
# créer un utilisateur 
def create_user(mail: str, pseudo: str, password: str, can_edit: bool): 
    conn = connect_db() 
    cursor = conn.cursor() 
    query = "SELECT id_user FROM user WHERE mail = %s OR pseudo = %s"
    cursor.execute(query, (mail, pseudo))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Email or pseudo already exists")
    query = "INSERT INTO user (mail, pseudo, password, can_edit) VALUES (%s, %s, %s, %s)" 
    cursor.execute(query, (mail, pseudo, password, can_edit))
    conn.commit() 
    user_id = cursor.lastrowid 
    cursor.close() 
    conn.close() 
    return user_id 
# mettre à jour un utilisateur 
def update_user(user_id: int, payload: UserUpdate) -> bool: 
    data = payload.model_dump(exclude_none=True) 
    if not data: 
        return False 
    conn = connect_db() 
    cursor = conn.cursor() 
    # construction dynamique de la requete SQL en fonction des champs à mettre à jour 
    set_clause = ", ".join([f"{k}=%s" for k in data.keys()]) 
    values = list(data.values()) + [user_id] 
    query = f"UPDATE user SET {set_clause} WHERE id_user=%s" 
    cursor.execute(query, values) 
    conn.commit() 
    updated = cursor.rowcount > 0 
    cursor.close() 
    conn.close() 
    return updated 
# supprimer un utilisateur 
def delete_user(user_id: int): 
    conn = connect_db() 
    cursor = conn.cursor() 
    query = "DELETE FROM user WHERE id_user = %s" 
    cursor.execute(query, (user_id,)) 
    conn.commit() 
    cursor.close() 
    conn.close() 
# routes 
@router.get("/") 
def read_users(): 
    return get_all_users() 
@router.get("/{user_id}") 
def read_user(user_id: int): 
    user = get_user_by_id(user_id) 
    if not user: 
        raise HTTPException(status_code=404, detail="User not found") 
    return user 
@router.post("/") 
def create_new_user(payload: UserCreate): 
    user_id = create_user(payload.mail, payload.pseudo, payload.password, payload.can_edit) 
    return {"id_user": user_id}
@router.patch("/{user_id}") 
def patch_user(user_id: int, payload: UserUpdate): 
    user = get_user_by_id(user_id) 
    if not user: 
        raise HTTPException(status_code=404, detail="User not found") 
    ok = update_user(user_id, payload) 
    if not ok: 
        return {"message": "Nothing to update"} 
    return {"message": "User updated"} 
@router.delete("/{user_id}") 
def delete_existing_user(user_id: int): 
    user = get_user_by_id(user_id) 
    if not user: 
        raise HTTPException(status_code=404, detail="User not found") 
    delete_user(user_id) 
    return {"message": "User deleted"}