from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
from app.models.project import ProjectStatus
from .user import User

class ProjectBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = ProjectStatus.PLANNING
    deadline: Optional[datetime] = None

class ProjectCreate(ProjectBase):
    title: str

class ProjectUpdate(ProjectBase):
    pass

class ProjectInDBBase(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Project(ProjectInDBBase):
    owner: User
    members: List[User] = []

class ProjectDetail(Project):
    # Include tasks if needed
    pass
