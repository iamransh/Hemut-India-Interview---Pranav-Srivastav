from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class QuestionCreate(BaseModel):
    message: str


class QuestionResponse(BaseModel):
    question_id: int
    message: str
    status: str
    created_at: datetime

    class Config:
        form_attributes = True
