"use client";

import { Pause, Pencil, Play, RotateCw, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useLayoutEffect, useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomSheet } from "@/components/BottomSheet";
import { progressText } from "@/components/PlanCard";
import { DateField, WeekdayPicker } from "@/components/PlanFields";
import { PlanDetailSkeleton } from "@/components/Skeleton";
import { useTaskActions } from "@/components/TaskActions";
import { Badge, Button, ErrorBox, Field, ProgressBar, TextInput, TypeIcon, cx } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { dDay, fmtDot, rangeText, TYPE_LABEL, todayISO, UNIT, weekdayName } from "@/lib/format";
import type { PlanDetail, Task } from "@/lib/types";

function recordBadge(t: Task) {
  if (!t.done) return t.date === todayISO() ? <Badge tone="gray">오늘</Badge> : <Badge tone="gray">미완료</Badge>;
  if (t.plan_type === "routine" || t.actual_end == null || t.target_end == null) return <Badge>완료</Badge>;
  const diff = t.actual_end - t.target_end;
  const unit = UNIT[t.plan_type];
  const verb = t.plan_type === "book" ? "읽음" : "들음";
  if (diff < 0) return <Badge tone="yellow">{`${-diff}${unit} 덜 ${verb}`}</Badge>;
  if (diff > 0) return <Badge>{`${diff}${unit} 더 ${verb}`}</Badge>;
  return <Badge>완료</Badge>;
}

export default function PlanDetailPage() {
  // URL 파라미터는 요청 시점에만 알 수 있어서 Suspense로 감싼다
  return (
    <Suspense
      fallback={
        <>
          <AppBar title="플랜 상세" />
          <PlanDetailSkeleton />
        </>
      }
    >
      <PlanDetailView />
    </Suspense>
  );
}

function PlanDetailView() {
  const { id } = useParams<{ id: string }>();
  const planId = Number(id);
  const router = useRouter();
  const { data: plan, error, reload } = useApi(() => api.plan(planId), `plan-${planId}`);
  const actions = useTaskActions(reload);
  const [showAll, setShowAll] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  // 화면을 떠나면(Activity로 숨겨지면) 수정 시트를 닫아 둔다
  useLayoutEffect(() => () => setEditing(false), []);

  if (error && !plan)
    return (
      <main>
        <AppBar title="플랜 상세" />
        <div className="px-5">
          <ErrorBox message={error} onRetry={reload} />
        </div>
      </main>
    );
  if (!plan)
    return (
      <main>
        <AppBar title="플랜 상세" />
        <PlanDetailSkeleton />
      </main>
    );

  const unit = UNIT[plan.type];
  const records = showAll ? plan.records : plan.records.slice(0, 4);

  async function togglePause() {
    if (!plan) return;
    setBusy(true);
    try {
      await api.updatePlan(plan.id, { status: plan.status === "paused" ? "active" : "paused" });
      reload();
    } catch (e) {
      alert(e instanceof Error ? e.message : "변경에 실패했어요");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!plan || !confirm(`'${plan.title}' 플랜을 삭제할까요?\n수행 기록도 함께 지워져요.`)) return;
    try {
      await api.deletePlan(plan.id);
      router.replace("/plans");
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제에 실패했어요");
    }
  }

  return (
    <main className="pb-10">
      <AppBar title="플랜 상세" />
      <div className="space-y-4 px-5">
        <section className="glass-card border-glass-border-green! p-5">
          <div className="flex items-center gap-3">
            <TypeIcon type={plan.type} active />
            <div className="min-w-0">
              <p className="text-[12px] text-text-sub">
                {TYPE_LABEL[plan.type]} · {weekdayName(plan.weekdays)}
                {plan.status !== "active" && ` · ${plan.status === "done" ? "완료" : "보류"}`}
              </p>
              <p className="truncate text-[18px] font-semibold">{plan.title}</p>
            </div>
          </div>
          <p className="mt-5 text-[13px] text-text-sub">남은 기간</p>
          <div className="flex items-end justify-between">
            <p className="text-[40px] font-semibold leading-tight text-primary">{dDay(plan.d_day)}</p>
            <p className="pb-2 text-[13px] text-text-sub">{fmtDot(plan.end_date)} 종료</p>
          </div>
          <div className="mt-3 flex justify-between text-[13px]">
            <span className="font-semibold">진도율 {plan.progress}%</span>
            <span className="text-text-sub">{progressText(plan)}</span>
          </div>
          <ProgressBar value={plan.progress} className="mt-2" />
        </section>

        <div className="grid grid-cols-3 gap-2">
          <Stat label="하루 할당" value={`${plan.type === "routine" ? 1 : plan.daily_amount}${unit}`} />
          <Stat label="남은 분량" value={`${plan.remaining_amount}${unit}`} />
          <Stat label="남은 일수" value={`${plan.remaining_days}일`} />
        </div>

        {plan.type !== "routine" && plan.status === "active" && (
          <section className="glass-card p-5">
            <div className="flex gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-inner bg-primary-glass text-primary">
                <RotateCw size={20} />
              </span>
              <div>
                <p className="text-[16px] font-semibold">일정 재계산</p>
                <p className="mt-1 text-[13px] text-text-sub">밀렸거나 미리 했다면 남은 분량을 남은 일수로 다시 나눠요</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 h-12 border-glass-border-green" onClick={() => actions.openReplan(plan.id)}>
              남은 일정 다시 나누기
            </Button>
          </section>
        )}

        <section className="pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold">수행 기록</h2>
            {plan.records.length > 4 && (
              <button className="text-[13px] text-text-sub" onClick={() => setShowAll(!showAll)}>
                {showAll ? "접기" : "전체 보기"}
              </button>
            )}
          </div>
          <div className="glass-card mt-3 divide-y divide-line-regular px-5">
            {records.length === 0 && <p className="py-5 text-center text-[14px] text-text-sub-weak">아직 수행 기록이 없어요</p>}
            {records.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-4">
                <div>
                  <p className="text-[12px] text-text-sub-weak">{fmtDot(t.date)}</p>
                  <p className="mt-0.5 text-[15px] font-semibold">
                    {t.plan_type === "routine" ? `${t.routine_index}회째` : rangeText(t.plan_type, t.target_start, t.target_end, " ~ ").replace(/^(\d+)\D+ ~/, "$1 ~")}
                  </p>
                </div>
                {recordBadge(t)}
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <ActionButton icon={<Pencil size={18} />} label="수정" onClick={() => setEditing(true)} />
          <ActionButton
            icon={plan.status === "paused" ? <Play size={18} /> : <Pause size={18} />}
            label={plan.status === "paused" ? "재개" : "보류"}
            disabled={busy || plan.status === "done"}
            onClick={togglePause}
          />
          <ActionButton icon={<Trash2 size={18} />} label="삭제" danger onClick={remove} />
        </div>
      </div>

      <BottomSheet open={editing} onClose={() => setEditing(false)}>
        {editing && (
          <EditForm
            plan={plan}
            onSaved={() => {
              setEditing(false);
              reload();
            }}
          />
        )}
      </BottomSheet>
      {actions.sheets}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card rounded-inner! py-4 text-center">
      <p className="text-[12px] text-text-sub">{label}</p>
      <p className="mt-1 text-[18px] font-semibold">{value}</p>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  danger,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "glass-card flex h-14 items-center justify-center gap-2 rounded-inner! text-[14px] font-medium disabled:opacity-40",
        danger ? "text-[#F04438]" : "text-text-main",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function EditForm({ plan, onSaved }: { plan: PlanDetail; onSaved: () => void }) {
  const [title, setTitle] = useState(plan.title);
  const [end, setEnd] = useState(plan.end_date);
  const [weekdays, setWeekdays] = useState(plan.weekdays);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await api.updatePlan(plan.id, { title, end_date: end, weekdays });
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했어요");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[19px] font-semibold">플랜 수정</h2>
      <Field label="제목">
        <TextInput value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <DateField label="종료일" value={end} min={plan.start_date} onChange={setEnd} />
      <WeekdayPicker value={weekdays} onChange={setWeekdays} />
      <p className="text-[12px] text-text-sub-weak">종료일이나 요일을 바꾸면 남은 분량을 다시 나눠요.</p>
      {error && <p className="text-[13px] text-[#D92D20]">{error}</p>}
      <Button disabled={saving || !title.trim() || weekdays.length === 0} onClick={save}>
        저장하기
      </Button>
    </div>
  );
}
