from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, models
from app.api import deps
from app.models.user import UserRole

router = APIRouter()

@router.get("/", response_model=List[schemas.project.Project])
def read_projects(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve projects.
    """
    if current_user.role == UserRole.ADMIN:
        projects = db.query(models.Project).offset(skip).limit(limit).all()
    else:
        # Get projects where user is owner or member
        projects = db.query(models.Project).filter(
            (models.Project.owner_id == current_user.id) | 
            (models.Project.members.any(id=current_user.id))
        ).offset(skip).limit(limit).all()
    return projects

@router.post("/", response_model=schemas.project.Project)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: schemas.project.ProjectCreate,
    current_user: models.User = Depends(deps.check_role([UserRole.ADMIN, UserRole.MANAGER])),
) -> Any:
    """
    Create new project.
    """
    project = models.Project(
        **project_in.model_dump(),
        owner_id=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/{id}", response_model=schemas.project.Project)
def read_project(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get project by ID.
    """
    project = db.query(models.Project).filter(models.Project.id == id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role != UserRole.ADMIN and \
       project.owner_id != current_user.id and \
       not any(m.id == current_user.id for m in project.members):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return project
