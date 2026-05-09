from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import schemas, models
from app.api import deps
from app.models.user import UserRole

router = APIRouter()

@router.get("/", response_model=List[schemas.task.Task])
def read_tasks(
    db: Session = Depends(deps.get_db),
    project_id: int = None,
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve tasks.
    """
    query = db.query(models.Task)
    if project_id:
        query = query.filter(models.Task.project_id == project_id)
    
    if current_user.role != UserRole.ADMIN:
        # Filter tasks based on project membership or assignment
        query = query.join(models.Project).filter(
            (models.Project.owner_id == current_user.id) |
            (models.Project.members.any(id=current_user.id)) |
            (models.Task.assignee_id == current_user.id)
        )
    
    tasks = query.offset(skip).limit(limit).all()
    return tasks

@router.post("/", response_model=schemas.task.Task)
def create_task(
    *,
    db: Session = Depends(deps.get_db),
    task_in: schemas.task.TaskCreate,
    current_user: models.User = Depends(deps.check_role([UserRole.ADMIN, UserRole.MANAGER])),
) -> Any:
    """
    Create new task.
    """
    # Check if project exists and user has access
    project = db.query(models.Project).filter(models.Project.id == task_in.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role != UserRole.ADMIN and project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions to add tasks to this project")

    task = models.Task(**task_in.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.patch("/{id}", response_model=schemas.task.Task)
def update_task(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    task_in: schemas.task.TaskUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a task.
    """
    task = db.query(models.Task).filter(models.Task.id == id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check permissions: Admin, Manager of project, or Assignee (for status updates)
    project = task.project
    is_manager = current_user.role == UserRole.ADMIN or project.owner_id == current_user.id
    is_assignee = task.assignee_id == current_user.id

    if not is_manager and not is_assignee:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    update_data = task_in.model_dump(exclude_unset=True)
    
    # If not manager, only allow status updates
    if not is_manager and is_assignee:
        allowed_fields = {"status"}
        update_data = {k: v for k, v in update_data.items() if k in allowed_fields}

    for field in update_data:
        setattr(task, field, update_data[field])

    db.add(task)
    db.commit()
    db.refresh(task)
    return task
