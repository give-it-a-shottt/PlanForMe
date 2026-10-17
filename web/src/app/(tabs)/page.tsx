"use client";

import { Bell, ChevronRight, RotateCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { useTaskActions } from "@/components/TaskActions";
import { Chip, Empty, ErrorBox, ProgressBar } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { fmtLong, overdueLabel } from "@/lib/format";
import type { PlanType } from "@/lib/types";

const FILTERS: { key: PlanType | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "book", label: "책" },
  { key: "lecture", label: "강의" },
  { key: "routine", label: "일반" },
];

export default function HomePage() {
  const { data, error, loading, reload } = useApi(api.today, "today");
  const actions = useTaskActions(reload);
  const [filter, setFilter] = useState<PlanType | "all">("all");

  if (loading && !data) return <p className="px-5 pt-16 text-text-sub-weak">불러오는 중...</p>;
  if (error && !data)
    return (
      <div className="px-5 pt-16">
        <ErrorBox message={error} onRetry={reload} />
      </div>
    );
  if (!data) return null;

  const left = data.total_count - data.done_count;
  const rate = data.total_count ? Math.round((data.done_count / data.total_count) * 100) : 0;
  const tasks = filter === "all" ? data.tasks : data.tasks.filter((t) => t.plan_type === filter);
  const overdue = data.overdue[0];
  const headline =
    data.total_count === 0 ? "오늘은\n할 일이 없어요" : left === 0 ? "오늘 할 일을\n모두 끝냈어요!" : `오늘 할 일이\n${left}개 남았어요`;

  return (
    <main className="px-5 pt-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[14px] text-text-sub">{fmtLong(data.date)}</p>
          <h1 className="mt-1 whitespace-pre-line text-[24px] font-semibold leading-[1.4]">{headline}</h1>
        </div>
        <Link
          href="/notifications"
          aria-label="알림"
          className="relative flex size-11 items-center justify-center rounded-full bg-glass-elevated text-icon-main shadow-glass"
        >
          <Bell size={22} />
          {(left > 0 || overdue) && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-[#F04438]" />}
        </Link>
      </div>

      <section className="glass-card mt-6 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[14px] font-medium">오늘 달성률</p>
            <p className="mt-1 text-[12px] text-text-sub">
              {data.total_count}개 중 {data.done_count}개 완료
            </p>
          </div>
          <p className="text-[36px] font-semibold leading-none text-primary">
            {rate}
            <span className="ml-1 text-[16px] text-text-main">%</span>
          </p>
        </div>
        <ProgressBar value={rate} className="mt-4" />
      </section>

      {overdue && (
        <button
          onClick={() => actions.openReplan(overdue.plan_id)}
          className="mt-4 flex w-full items-center gap-3 rounded-card border border-glass-border-green bg-primary-glass p-4 text-left"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-inner bg-primary text-white">
            <RotateCw size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold">밀린 분량이 있어요</span>
            <span className="mt-0.5 block truncate text-[12px] text-text-sub">
              {overdue.plan_title} · {overdueLabel(overdue)} → 남은 일정 다시 나누기
            </span>
          </span>
          <ChevronRight size={20} className="shrink-0 text-icon-sub" />
        </button>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">오늘의 할 일</h2>
          <span className="text-[13px] text-text-sub-weak">{data.total_count}개</span>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <Chip key={f.key} selected={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </Chip>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {tasks.length === 0 ? (
            <Empty>
              {data.total_count === 0 ? (
                <>
                  아직 오늘 할 일이 없어요.
                  <br />
                  <Link href="/new" className="font-semibold text-primary">
                    + 새 플랜 만들기
                  </Link>
                </>
              ) : (
                "이 유형의 할 일은 없어요"
              )}
            </Empty>
          ) : (
            tasks.map((t) => <TaskCard key={t.id} task={t} onToggle={actions.toggle} />)
          )}
        </div>
      </section>
      {actions.sheets}
    </main>
  );
}
