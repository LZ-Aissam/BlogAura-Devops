from pydantic import BaseModel

class LoginPayload(BaseModel):
    mail: str
    password: str

class UserCreate(BaseModel):
    mail: str
    pseudo: str
    password: str
    can_edit: bool

class UserUpdate(BaseModel):
    mail: str | None = None
    pseudo: str | None = None
    password: str | None = None
    can_edit: bool | None = None

class CommentCreate(BaseModel):
    text: str

class ReactCreate(BaseModel):
    emoji: str

class PostCreate(BaseModel):
    title: str
    text: str
    user_id: int