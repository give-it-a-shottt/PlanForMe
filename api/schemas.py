from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator

PlanType = Literal["book", "lecture", "routine"]
PlanStatus = Literal["active", "done", "paused"]


class PlanInput(BaseModel):
    type: PlanType
    title: str = Field(min_length=1, max_length=200)
    start_date: date
    end_date: date
    weekdays: list[int] = Field(min_length=1)
    current_page: int | None = Field(default=None, ge=1)
    last_page: int | None = Field(default=None, ge=1)
    total_lectures: int | None = Field(default=None, ge=1, le=1000)
    avg_minutes: int | None = Field(default=None, ge=1, le=600)

    @model_validator(mode="after")
    def check(self):
        if self.end_date < self.start_date:
            raise ValueError("종료일은 시작일보다 같거나 늦어야 해요")
        if any(w < 0 or w > 6 for w in self.weekdays):
            raise ValueError("요일 값이 올바르지 않아요")
        if self.type == "book":
            if self.current_page is None or self.last_page is None:
                raise ValueError("현재 페이지와 마지막 페이지를 입력해 주세요")
            if self.last_page < self.current_page:
                raise ValueError("마지막 페이지는 현재 페이지보다 크거나 같아야 해요")
        if self.type == "lecture" and (self.total_lectures is None or self.avg_minutes is None):
            raise ValueError("총 강의 수와 평균 길이를 입력해 주세요")
        return self


class ScheduleItemOut(BaseModel):
    date: date
    target_start: int | None
    target_end: int | None
    amount: int


class PreviewOut(BaseModel):
    valid_days: int
    total_amount: int
    daily_amount: int
    last_day_amount: int
    daily_minutes: int | None
    overload: bool
    extend_weeks: int | None
    extend_daily: int | None
    first_week: list[ScheduleItemOut]


class PlanOut(BaseModel):
    id: int
    type: PlanType
    title: str
    start_date: date
    end_date: date
    weekdays: list[int]
    status: PlanStatus
    start_unit: int | None
    end_unit: int | None
    avg_minutes: int | None
    daily_amount: int
    position: int | None  # 책/강의: 현재 도달한 페이지/강
    done_amount: int
    total_amount: int
    progress: int  # 0 ~ 100
    remaining_amount: int
    remaining_days: int
    d_day: int


class TaskOut(BaseModel):
    id: int
    plan_id: int
    plan_type: PlanType
    plan_title: str
    date: date
    target_start: int | None
    target_end: int | None
    target_amount: int
    actual_end: int | None
    done: bool
    completed_at: datetime | None
    avg_minutes: int | None
    routine_index: int | None
    routine_total: int | None


class PlanDetailOut(PlanOut):
    records: list[TaskOut]


class PlanUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    end_date: date | None = None
    weekdays: list[int] | None = Field(default=None, min_length=1)
    status: PlanStatus | None = None


class ReplanSuggestion(BaseModel):
    plan_id: int
    plan_type: PlanType
    plan_title: str
    remaining_amount: int
    remaining_days: int
    current_daily: int
    new_daily: int
    start_from: date
    end_date: date
    weekdays: list[int]


class CompleteInput(BaseModel):
    actual_end: int | None = Field(default=None, ge=0)


class CompleteOut(BaseModel):
    task: TaskOut
    diff: int | None
    suggestion: ReplanSuggestion | None


class OverdueOut(BaseModel):
    plan_id: int
    plan_type: PlanType
    plan_title: str
    target_start: int | None
    target_end: int | None
    target_amount: int


class TodayOut(BaseModel):
    date: date
    tasks: list[TaskOut]
    done_count: int
    total_count: int
    overdue: list[OverdueOut]


class NotificationOut(BaseModel):
    kind: Literal["replan", "reminder", "achieved", "missed"]
    day: Literal["today", "yesterday"]
    title: str
    body: str
    time: str | None
    plan_id: int | None


class StatBar(BaseModel):
    label: str
    rate: int
    is_current: bool


class StatsOut(BaseModel):
    period: Literal["week", "month"]
    rate: int
    prev_rate: int
    bars: list[StatBar]
    book_pages: int
    lectures: int
    routines: int
    streak: int
