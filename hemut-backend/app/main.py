from fastapi import FastAPI, Depends, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import SessionLocal, engine
from . import models, schemas, crud
from .auth import create_token
from .dependencies import admin_required
from .websocket import manager

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to the Hemut Backend!"}


@app.post("/auth/register")
def register(user: schemas.UserCreate, db=Depends(get_db)):
    u = crud.create_user(db, user)
    if not u:
        raise HTTPException(status_code=401, detail="Invalid data")
    return {"status": "registered"}


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(user: schemas.UserCreate, db=Depends(get_db)):
    u = crud.authenticate(db, user.username, user.password)
    if not u:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": u.user_id, "is_admin": u.is_admin})
    return {"access_token": token}


@app.post("/questions", response_model=schemas.QuestionResponse)
async def submit_question(payload: schemas.QuestionCreate, db=Depends(get_db)):
    q = crud.create_question(db, payload.message)
    await manager.broadcast({"event": "new_question"})
    return q


@app.get("/questions", response_model=list[schemas.QuestionResponse])
def list_questions(db=Depends(get_db)):
    return crud.get_questions(db)


@app.post("/questions/{qid}/escalate")
async def escalate(qid: int, admin=Depends(admin_required), db=Depends(get_db)):
    crud.escalate_question(db, qid)
    await manager.broadcast({"event": "marked_escalated", "question_id": qid})
    return {"status": "escalated"}


@app.post("/questions/{qid}/answer")
async def answer(qid: int, admin=Depends(admin_required), db=Depends(get_db)):
    crud.mark_answered(db, qid)
    await manager.broadcast({"event": "marked_answered", "question_id": qid})
    return {"status": "answered"}


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await manager.connect(ws)
    try:
        while True:
            await ws.receive_text()
    except:
        manager.disconnect(ws)
