from datetime import date, timedelta
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

import services
from db import get_db
from models import DailyTask, Plan
from schemas import NotificationOut, StatBar, StatsOut
from timeutil import today_kst

router = APIRouter(tags=["insights"])

UNIT = {"book": "p", "lecture": "강", "routine": "회"}


def _tasks_between(db: Session, start: date, end: date) -> list[DailyTask]:
    stmt = (
        select(DailyTask)
        .join(Plan)
        .where(DailyTask.date >= start, DailyTask.date <= end, Plan.status != "paused")
        .order_by(DailyTask.date)
    )
    return list(db.scalars(stmt))


def _rate(tasks: list[DailyTask]) -> int:
    return round(sum(1 for t in tasks if t.done) / len(tasks) * 100) if tasks else 0


def _amount_done(t: DailyTask) -> int:
    if t.plan.type == "routine":
        return 1 if t.done else 0
    if t.actual_end is None or t.target_start is None:
        return 0
    return max(0, t.actual_end - t.target_start + 1)


@router.get("/calendar")
def calendar(year: int, month: int, db: Session = Depends(get_db)):
    """월간 뷰 Dot 표시용: 날짜별로 할 일이 있는 플랜 유형 목록."""
    start = date(year, month, 1)
    end = (date(year + month // 12, month % 12 + 1, 1)) - timedelta(days=1)
    days: dict[str, list[str]] = {}
    for t in _tasks_between(db, start, end):
        types = days.setdefault(t.date.isoformat(), [])
        if t.plan.type not in types:
            types.append(t.plan.type)
    return {"days": days}


def _streak(db: Session, today: date) -> int:
    tasks = _tasks_between(db, today - timedelta(days=365), today)
    by_day: dict[date, list[DailyTask]] = {}
    for t in tasks:
        by_day.setdefault(t.date, []).append(t)
    day = today
    if not (by_day.get(today) and all(t.done for t in by_day[today])):
        day = today - timedelta(days=1)
    count = 0
    for d in sorted((d for d in by_day if d <= day), reverse=True):
        if all(t.done for t in by_day[d]):
            count += 1
        else:
            break
    return count


@router.get("/stats", response_model=StatsOut)
def stats(period: Literal["week", "month"] = "week", db: Session = Depends(get_db)):
    today = today_kst()
    bars: list[StatBar] = []
    if period == "week":
        start = today - timedelta(days=today.weekday())
        for i, label in enumerate("월화수목금토일"):
            d = start + timedelta(days=i)
            bars.append(StatBar(label=label, rate=_rate(_tasks_between(db, d, d)) if d <= today else 0, is_current=d == today))
        prev_start, prev_end = start - timedelta(days=7), start - timedelta(days=1)
    else:
        start = today.replace(day=1)
        week_start = start - timedelta(days=start.weekday())
        n = 1
        while week_start <= today:
            ws, we = max(week_start, start), min(week_start + timedelta(days=6), today)
            bars.append(StatBar(label=f"{n}주", rate=_rate(_tasks_between(db, ws, we)), is_current=ws <= today <= week_start + timedelta(days=6)))
            week_start += timedelta(days=7)
            n += 1
        prev_end = start - timedelta(days=1)
        prev_start = prev_end.replace(day=1)

    done_tasks = [t for t in _tasks_between(db, date(2000, 1, 1), today + timedelta(days=366)) if t.done]
    return StatsOut(
        period=period,
        rate=_rate(_tasks_between(db, start, today)),
        prev_rate=_rate(_tasks_between(db, prev_start, prev_end)),
        bars=bars,
        book_pages=sum(_amount_done(t) for t in done_tasks if t.plan.type == "book"),
        lectures=sum(_amount_done(t) for t in done_tasks if t.plan.type == "lecture"),
        routines=sum(1 for t in done_tasks if t.plan.type == "routine"),
        streak=_streak(db, today),
    )


def _plan_streak(plan: Plan, until: date) -> int:
    count = 0
    for t in sorted((t for t in plan.tasks if t.date <= until), key=lambda t: t.date, reverse=True):
        if t.done:
            count += 1
        else:
            break
    return count


@router.get("/notifications", response_model=list[NotificationOut])
def notifications(remind_hour: int = Query(default=21, ge=0, le=23), db: Session = Depends(get_db)):
    """알림 센터: 별도 테이블 없이 현재 기록에서 만들어 낸다."""
    today = today_kst()
    yesterday = today - timedelta(days=1)
    items: list[NotificationOut] = []

    # 오늘 · 재계산 제안 (밀린 책/강의)
    seen: set[int] = set()
    for t in services.overdue_tasks(db, today):
        if t.plan_id in seen:
            continue
        seen.add(t.plan_id)
        plan = t.plan
        unit = UNIT[plan.type]
        remaining = plan.end_unit - max(
            [x.actual_end for x in plan.tasks if x.actual_end is not None], default=plan.start_unit - 1
        )
        items.append(
            NotificationOut(
                kind="replan",
                day="today",
                title=f"{plan.title} {t.target_start}{unit}{'이' if plan.type == 'lecture' else '가'} 밀렸어요",
                body=f"남은 {remaining}{unit}{'을' if plan.type == 'lecture' else '를'} 남은 기간에 다시 나눌까요?",
                time=None,
                plan_id=plan.id,
            )
        )

    # 오늘 · 리마인더
    today_tasks = _tasks_between(db, today, today)
    left = sum(1 for t in today_tasks if not t.done)
    if left:
        items.append(
            NotificationOut(
                kind="reminder",
                day="today",
                title=f"오늘 할 일이 {left}개 남았어요",
                body=f"{remind_hour}시 전에 마무리해 보세요",
                time=None,
                plan_id=None,
            )
        )

    # 어제 · 달성 / 미달성
    for t in _tasks_between(db, yesterday, yesterday):
        plan = t.plan
        unit = UNIT[plan.type]
        time = t.completed_at.strftime("%H:%M") if t.completed_at else None
        reached = plan.type == "routine" or (t.actual_end is not None and t.actual_end >= t.target_end)
        if t.done and reached:
            streak = _plan_streak(plan, yesterday)
            items.append(
                NotificationOut(
                    kind="achieved",
                    day="yesterday",
                    title=f"{plan.title} {streak}일 연속 달성!" if streak >= 2 else f"{plan.title} 달성!",
                    body="이 페이스면 종료일에 딱 맞게 끝나요",
                    time=time,
                    plan_id=plan.id,
                )
            )
        else:
            body = (
                "어제 루틴을 놓쳤어요"
                if plan.type == "routine"
                else f"목표 {t.target_amount}{unit} 중 {_amount_done(t)}{unit} 기록됐어요"
            )
            items.append(
                NotificationOut(kind="missed", day="yesterday", title=plan.title, body=body, time=time, plan_id=plan.id)
            )
    return items
