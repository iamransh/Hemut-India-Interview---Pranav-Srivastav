from sqlalchemy.orm import Session
from .models import User, Question
from .auth import hash_password, verify_password


def create_user(db: Session, user):
    u = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        is_admin=True,
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u


def authenticate(db: Session, username: str, password: str):
    user = db.query(User).filter_by(username=username).first()
    if user and verify_password(password, user.password):
        return user
    return None


def create_question(db: Session, message: str):
    if not message.strip():
        raise ValueError("Message cannot be empty")
    q = Question(message=message)
    db.add(q)
    db.commit()
    db.refresh(q)
    return q


def get_questions(db: Session):
    return (
        db.query(Question)
        .order_by((Question.status == "ESCALATED").desc(), Question.created_at.desc())
        .all()
    )


def escalate_question(db: Session, qid: int):
    q = db.query(Question).filter_by(question_id=qid).first()
    if q and q.status == "PENDING":
        q.status = "ESCALATED"
        db.commit()
    return q


def mark_answered(db: Session, qid: int):
    q = db.query(Question).filter_by(question_id=qid).first()
    if q:
        q.status = "ANSWERED"
        db.commit()
    return q
