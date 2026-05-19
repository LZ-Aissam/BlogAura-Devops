from db import connect_db 
from fastapi import APIRouter, HTTPException, Request 
from models import PostCreate

router = APIRouter()

def get_all_posts():
    conn = connect_db() 
    cursor = conn.cursor(dictionary=True) 
    query = "SELECT post.id_post, post.title, post.text, user.id_user, user.pseudo AS author_name, post.createdAt " \
            "FROM post JOIN user ON post.authorid = user.id_user ORDER BY post.createdAt DESC"
    cursor.execute(query) 
    result = cursor.fetchall() 

    for post in result:
        post_id = post['id_post']
        query = "SELECT id_user, emoji FROM react where id_post = %s"
        cursor.execute(query, (post_id,))
        reactions_data = cursor.fetchall()
        reactions = {}
        for row in reactions_data:
            emoji = row['emoji']
            user_id = row['id_user']
            if emoji not in reactions:
                reactions[emoji] = []
            reactions[emoji].append(user_id)
        post['reactions'] = reactions
    cursor.close() 
    conn.close() 
    return result

def get_post_by_id(post_id: int):
    conn = connect_db() 
    cursor = conn.cursor(dictionary=True)  
    query = "SELECT post.id_post, post.title, post.text, user.id_user, user.pseudo AS author_name " \
            "FROM post JOIN user ON post.authorid = user.id_user WHERE post.id_post = %s"
    cursor.execute(query, (post_id,)) 
    result = cursor.fetchone()

    query = "SELECT id_user, emoji FROM react where id_post = %s"
    cursor.execute(query, (post_id,))
    reactions_data = cursor.fetchall()

    reactions = {}
    for row in reactions_data:
        emoji = row['emoji']
        user_id = row['id_user']
        if emoji not in reactions:
            reactions[emoji] = []
        reactions[emoji].append(user_id)
    result['reactions'] = reactions
    cursor.close() 
    conn.close() 
    return result

def create_post(title: str, text: str, user_id: int):
    conn = connect_db() 
    cursor = conn.cursor() 
    query = "INSERT INTO post (title, text, authorId) VALUES (%s, %s, %s)" 
    cursor.execute(query, (title, text, user_id)) 
    conn.commit() 
    post_id = cursor.lastrowid 
    cursor.close() 
    conn.close() 
    return post_id

def delete_post(post_id: int):
    conn = connect_db() 
    cursor = conn.cursor() 
    query = "DELETE FROM post WHERE id_post = %s" 
    cursor.execute(query, (post_id,)) 
    conn.commit() 
    deleted = cursor.rowcount > 0 
    cursor.close() 
    conn.close() 
    return deleted

def update_post(post_id: int, title: str, text: str) -> bool:
    conn = connect_db() 
    cursor = conn.cursor() 
    query = "UPDATE post SET title=%s, text=%s WHERE id_post=%s" 
    cursor.execute(query, (title, text, post_id)) 
    conn.commit() 
    updated = cursor.rowcount > 0 
    cursor.close() 
    conn.close() 
    return updated

# routes
@router.get("/")
def read_posts():
    return get_all_posts()

@router.get("/{post_id}")
def read_post(post_id: int):
    post = get_post_by_id(post_id) 
    if post: return post 
    raise HTTPException(status_code=404, detail="Post not found")

@router.post("/")
def add_post(request: Request, post_create: PostCreate):
    post_id = create_post(post_create.title, post_create.text, post_create.user_id) 
    return {"message": "Post created", "id_post": post_id}

@router.patch("/{post_id}")
def modify_post(post_id: int, title: str, text: str):
    if update_post(post_id, title, text): 
        return {"message": "Post updated"} 
    raise HTTPException(status_code=404, detail="Post not found")

@router.delete("/{post_id}")
def remove_post(post_id: int):
    if delete_post(post_id): 
        return {"message": "Post deleted"} 
    raise HTTPException(status_code=404, detail="Post not found")