from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db import Base


class Plan(Base):
    __tablename__ = "plans"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(10))  # book | lecture | routine
    title: Mapped[str] = mapped_column(String(200))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    weekdays: Mapped[str] = mapped_column(String(20))  # "0,1,2,3,4" (월=0 … 일=6)
    status: Mapped[str] = mapped_column(String(10), default="active")  # active | done | paused

    # 책: 현재 페이지 ~ 마지막 페이지 / 강의: 1강 ~ 총 강의 수
    start_unit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    end_unit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    avg_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 강의 1강당 평균 길이

    daily_amount: Mapped[int] = mapped_column(Integer, default=1)  # 현재 기준 하루 할당량
    # 마지막으로 재계산한 시작일. 이 날짜 이전의 미완료 기록은 "밀림"으로 세지 않는다
    rebased_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    tasks: Mapped[list["DailyTask"]] = relationship(
        back_populates="plan", cascade="all, delete-orphan", order_by="DailyTask.date"
    )

    @property
    def weekday_set(self) -> set[int]:
        return {int(w) for w in self.weekdays.split(",") if w != ""}


class DailyTask(Base):
    __tablename__ = "daily_tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("plans.id", ondelete="CASCADE"), index=True)
    date: Mapped[date] = mapped_column(Date, index=True)

    # 목표 범위 (책: 페이지, 강의: 강 번호, 일반: 비어 있음)
    target_start: Mapped[int | None] = mapped_column(Integer, nullable=True)
    target_end: Mapped[int | None] = mapped_column(Integer, nullable=True)
    target_amount: Mapped[int] = mapped_column(Integer, default=1)

    actual_end: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 실제로 도달한 페이지/강
    done: Mapped[bool] = mapped_column(Boolean, default=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    plan: Mapped[Plan] = relationship(back_populates="tasks")
