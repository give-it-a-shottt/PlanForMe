from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

import services
from db import get_db
from models import DailyTask
from schemas import CompleteInput, CompleteOut, OverdueOut, TaskOut, TodayOut
from timeutil import today_kst

router = APIRouter(tags=["tasks"])


def _load(db: Session, task_id: int) -> DailyTask:
    task = db.get(DailyTask, task_id)
    if task is None:
        raise HTTPException(404, "할 일을 찾을 수 없어요")
    return task


@router.get("/today", response_model=TodayOut)
def today(db: Session = Depends(get_db)):
    day = today_kst()
    tasks = services.tasks_on(db, day)

    overdue: dict[int, OverdueOut] = {}
    for t in services.overdue_tasks(db, day):
        if t.plan_id not in overdue:
            overdue[t.plan_id] = OverdueOut(
                plan_id=t.plan_id,
                plan_type=t.plan.type,
                plan_title=t.plan.title,
                target_start=t.target_start,
                target_end=t.target_end,
                target_amount=t.target_amount,
            )

    return TodayOut(
        date=day,
        tasks=[services.task_out(t) for t in tasks],
        done_count=sum(1 for t in tasks if t.done),
        total_count=len(tasks),
        overdue=list(overdue.values()),
    )


@router.get("/tasks", response_model=list[TaskOut])
def tasks_by_date(day: date = Query(alias="date"), db: Session = Depends(get_db)):
    return [services.task_out(t) for t in services.tasks_on(db, day)]


@router.post("/tasks/{task_id}/complete", response_model=CompleteOut)
def complete(task_id: int, data: CompleteInput, db: Session = Depends(get_db)):
    task = _load(db, task_id)
    try:
        task, diff, sugg = services.complete_task(db, task, data.actual_end, today_kst())
    except services.PlanError as e:
        raise HTTPException(400, str(e))
    return CompleteOut(task=services.task_out(task), diff=diff, suggestion=sugg)


@router.post("/tasks/{task_id}/uncomplete", response_model=TaskOut)
def uncomplete(task_id: int, db: Session = Depends(get_db)):
    return services.task_out(services.uncomplete_task(db, _load(db, task_id)))
