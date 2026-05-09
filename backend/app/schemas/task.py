from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.models.task import TaskStatus, TaskPriority
from .user import User

class TaskBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = TaskStatus.TODO
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskCreate(TaskBase):
    title: str
    project_id: int

class TaskUpdate(TaskBase):
    pass

class TaskInDBBase(TaskBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Task(TaskInDBBase):
    assignee: Optional[User] = None
