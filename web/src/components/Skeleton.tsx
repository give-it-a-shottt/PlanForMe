// 디자인 코드라 설명 생략 (데이터를 불러오는 동안 보여 줄 물결 로딩 막대)
import { cx } from "./ui";

export function Bar({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cx("skeleton", className)} style={style} />;
}

function Loading({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-label="불러오는 중" className={className}>
      {children}
    </div>
  );
}

/** 할 일 카드 모양 */
export function TaskCardSkeleton() {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <Bar className="size-11 rounded-inner" />
      <div className="flex-1 space-y-2">
        <Bar className="h-3 w-28" />
        <Bar className="h-4 w-40" />
        <Bar className="h-3 w-20" />
      </div>
      <Bar className="size-7 rounded-lg" />
    </div>
  );
}

export function TaskListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Loading className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </Loading>
  );
}

/** 플랜 카드 모양 */
export function PlanListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Loading className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="glass-card p-5">
          <div className="flex items-center gap-3">
            <Bar className="size-11 rounded-inner" />
            <div className="flex-1 space-y-2">
              <Bar className="h-3 w-20" />
              <Bar className="h-4 w-44" />
            </div>
            <Bar className="h-6 w-12 rounded-full" />
          </div>
          <Bar className="mt-5 h-2 w-full rounded-full" />
          <Bar className="mt-3 h-3 w-24" />
        </div>
      ))}
    </Loading>
  );
}

export function HomeSkeleton() {
  return (
    <Loading className="px-5 pt-8">
      <Bar className="h-4 w-32" />
      <Bar className="mt-3 h-7 w-44" />
      <Bar className="mt-2 h-7 w-36" />
      <div className="glass-card mt-6 p-5">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <Bar className="h-4 w-20" />
            <Bar className="h-3 w-24" />
          </div>
          <Bar className="h-9 w-16" />
        </div>
        <Bar className="mt-4 h-2 w-full rounded-full" />
      </div>
      <Bar className="mt-8 h-5 w-24" />
      <div className="mt-4">
        <TaskListSkeleton />
      </div>
    </Loading>
  );
}

export function PlanDetailSkeleton() {
  return (
    <Loading className="space-y-4 px-5">
      <div className="glass-card p-5">
        <div className="flex items-center gap-3">
          <Bar className="size-11 rounded-inner" />
          <div className="flex-1 space-y-2">
            <Bar className="h-3 w-20" />
            <Bar className="h-5 w-48" />
          </div>
        </div>
        <Bar className="mt-6 h-10 w-28" />
        <Bar className="mt-4 h-2 w-full rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <Bar key={i} className="h-20 rounded-inner" />
        ))}
      </div>
      <Bar className="h-36 rounded-card" />
      <Bar className="h-48 rounded-card" />
    </Loading>
  );
}

export function StatsSkeleton() {
  return (
    <Loading>
      <Bar className="mt-4 h-3 w-24" />
      <Bar className="mt-3 h-10 w-28" />
      <div className="mt-4 flex h-32 items-end justify-between gap-2">
        {[60, 85, 40, 70, 50, 90, 30].map((h, i) => (
          <Bar key={i} className="w-full max-w-7 rounded-full" style={{ height: `${h}%` }} />
        ))}
      </div>
    </Loading>
  );
}

export function PreviewSkeleton() {
  return (
    <Loading className="glass-card p-6">
      <Bar className="h-4 w-20" />
      <Bar className="mt-3 h-12 w-24" />
      <Bar className="mt-3 h-3 w-40" />
      <div className="my-4 h-px bg-line-regular" />
      <div className="space-y-3">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-3/4" />
      </div>
    </Loading>
  );
}
