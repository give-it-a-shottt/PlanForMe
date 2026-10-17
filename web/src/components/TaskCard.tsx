"use client";

// 디자인 코드라 설명 생략
import { taskMeta, taskSub, taskTitle } from "@/lib/format";
import type { Task } from "@/lib/types";
import { Checkbox, TypeIcon, cx } from "./ui";

export function TaskCard({ task, onToggle }: { task: Task; onToggle: (task: Task) => void }) {
  return (
    <div className="glass-card flex items-center gap-3 p-4">
      <TypeIcon type={task.plan_type} done={task.done} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-text-sub-weak">{taskMeta(task)}</p>
        <p className={cx("mt-0.5 truncate text-[16px] font-semibold", task.done && "text-text-disabled")}>
          {taskTitle(task)}
        </p>
        <p className="mt-0.5 text-[13px] text-text-sub">{taskSub(task)}</p>
      </div>
      <Checkbox checked={task.done} onClick={() => onToggle(task)} label={`${taskTitle(task)} 완료`} />
    </div>
  );
}
