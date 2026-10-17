"use client";

// 디자인 코드라 설명 생략
import { Target } from "lucide-react";
import Link from "next/link";
import { dDay, TYPE_LABEL, UNIT, weekdayName } from "@/lib/format";
import type { Plan } from "@/lib/types";
import { Badge, ProgressBar, TypeIcon } from "./ui";

export function progressText(p: Plan) {
  if (p.type === "routine") return `${p.done_amount} / ${p.total_amount}회`;
  return `${p.position} / ${p.end_unit}${UNIT[p.type]}`;
}

export function dailyText(p: Plan) {
  if (p.type === "book") return `하루 ${p.daily_amount}페이지`;
  if (p.type === "lecture") return `하루 ${p.daily_amount}강 · 약 ${p.daily_amount * (p.avg_minutes ?? 0)}분`;
  return `${weekdayName(p.weekdays)} 루틴`;
}

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <Link href={`/plan/${plan.id}`} className="glass-card block p-5">
      <div className="flex items-center gap-3">
        <TypeIcon type={plan.type} />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] text-text-sub-weak">
            {TYPE_LABEL[plan.type]} · {weekdayName(plan.weekdays)}
          </p>
          <p className="truncate text-[16px] font-semibold">{plan.title}</p>
        </div>
        <Badge tone={plan.status === "active" ? "green" : "gray"}>
          {plan.status === "done" ? "완료" : plan.status === "paused" ? "보류" : dDay(plan.d_day)}
        </Badge>
      </div>
      <div className="mt-4 flex justify-between text-[13px]">
        <span className="font-semibold">진도율 {plan.progress}%</span>
        <span className="text-text-sub">{progressText(plan)}</span>
      </div>
      <ProgressBar value={plan.progress} className="mt-2" />
      <p className="mt-3 flex items-center gap-1.5 text-[12px] text-text-sub">
        <Target size={14} />
        {dailyText(plan)}
      </p>
    </Link>
  );
}
