from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api import deps
from app.models import Project, Task, User
from app.models.user import UserRole

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
):
    if current_user.role == UserRole.ADMIN:
        total_projects = db.query(Project).count()
        total_tasks = db.query(Task).count()
        completed_tasks = db.query(Task).filter(Task.status == "completed").count()
        pending_tasks = db.query(Task).filter(Task.status != "completed").count()
    else:
        # User specific stats
        projects_query = db.query(Project).filter(
            (Project.owner_id == current_user.id) | 
            (Project.members.any(id=current_user.id))
        )
        total_projects = projects_query.count()
        
        project_ids = [p.id for p in projects_query.all()]
        tasks_query = db.query(Task).filter(Task.project_id.in_(project_ids))
        total_tasks = tasks_query.count()
        completed_tasks = tasks_query.filter(Task.status == "completed").count()
        pending_tasks = tasks_query.filter(Task.status != "completed").count()

    return {
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "productivity_score": 85, # Mock for now
    }
