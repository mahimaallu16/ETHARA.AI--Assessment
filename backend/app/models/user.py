from sqlalchemy import Column, Integer, String, Boolean, Enum
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    TEAM_MEMBER = "team_member"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.TEAM_MEMBER)

    # Relationships
    owned_projects = relationship("Project", back_populates="owner")
    assigned_tasks = relationship("Task", back_populates="assignee")
    comments = relationship("Comment", back_populates="author")
    notifications = relationship("Notification", back_populates="user")
    projects = relationship("Project", secondary="project_members", back_populates="members")
