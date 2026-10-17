from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

import services
from db import get_db
from models import Plan
from schemas import PlanDetailOut, PlanInput, PlanOut, PlanStatus, PlanUpdate, PreviewOut, ReplanSuggestion
from timeutil import today_kst

router = APIRouter(prefix="/plans", tags=["plans"])


def _load(db: Session, plan_id: int) -> Plan:
    plan = services.get_plan(db, plan_id)
    if plan is None:
        raise HTTPException(404, "플랜을 찾을 수 없어요")
    return plan


@router.post("/preview", response_model=PreviewOut)
def preview(data: PlanInput):
    try:
        return services.preview(data)
    except services.PlanError as e:
        raise HTTPException(400, str(e))


@router.post("", response_model=PlanOut, status_code=201)
def create(data: PlanInput, db: Session = Depends(get_db)):
    try:
        plan = services.create_plan(db, data)
    except services.PlanError as e:
        raise HTTPException(400, str(e))
    return services.plan_out(plan, today_kst())


@router.get("", response_model=list[PlanOut])
def list_plans(status: PlanStatus | None = Query(default=None), db: Session = Depends(get_db)):
    stmt = select(Plan).order_by(Plan.end_date, Plan.id)
    if status:
        stmt = stmt.where(Plan.status == status)
    today = today_kst()
    return [services.plan_out(p, today) for p in db.scalars(stmt)]


@router.get("/{plan_id}", response_model=PlanDetailOut)
def detail(plan_id: int, db: Session = Depends(get_db)):
    plan = _load(db, plan_id)
    today = today_kst()
    records = [services.task_out(t) for t in reversed(plan.tasks) if t.date <= today]
    return PlanDetailOut(**services.plan_out(plan, today).model_dump(), records=records)


@router.patch("/{plan_id}", response_model=PlanOut)
def update(plan_id: int, data: PlanUpdate, db: Session = Depends(get_db)):
    plan = _load(db, plan_id)
    today = today_kst()
    need_replan = False
    if data.title is not None:
        plan.title = data.title.strip()
    if data.end_date is not None and data.end_date != plan.end_date:
        if data.end_date < plan.start_date:
            raise HTTPException(400, "종료일은 시작일보다 같거나 늦어야 해요")
        plan.end_date = data.end_date
        need_replan = True
    if data.weekdays is not None:
        if any(w < 0 or w > 6 for w in data.weekdays):
            raise HTTPException(400, "요일 값이 올바르지 않아요")
        plan.weekdays = ",".join(str(w) for w in sorted(set(data.weekdays)))
        need_replan = True
    if data.status is not None and data.status != plan.status:
        # 보류를 풀면 남은 기간에 맞춰 다시 나눈다
        need_replan = need_replan or (plan.status == "paused" and data.status == "active")
        plan.status = data.status
    db.flush()
    if need_replan and plan.status == "active":
        try:
            services.apply_replan(db, plan, today)
        except services.PlanError as e:
            db.rollback()
            raise HTTPException(400, str(e))
    db.commit()
    db.refresh(plan)
    return services.plan_out(plan, today)


@router.delete("/{plan_id}", status_code=204)
def delete(plan_id: int, db: Session = Depends(get_db)):
    db.delete(_load(db, plan_id))
    db.commit()
    return Response(status_code=204)


@router.get("/{plan_id}/replan", response_model=ReplanSuggestion)
def replan_preview(plan_id: int, db: Session = Depends(get_db)):
    plan = _load(db, plan_id)
    if plan.type == "routine":
        raise HTTPException(400, "일반 루틴은 재계산할 분량이 없어요")
    return services.suggestion(plan, today_kst())


@router.post("/{plan_id}/replan", response_model=PlanOut)
def replan(plan_id: int, db: Session = Depends(get_db)):
    plan = _load(db, plan_id)
    today = today_kst()
    try:
        services.apply_replan(db, plan, today)
    except services.PlanError as e:
        raise HTTPException(400, str(e))
    return services.plan_out(plan, today)
