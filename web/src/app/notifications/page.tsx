"use client";

import { Check, CircleAlert, Clock, RotateCw, type LucideIcon } from "lucide-react";
import { AppBar } from "@/components/AppBar";
import { useTaskActions } from "@/components/TaskActions";
import { Empty, ErrorBox, cx } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { useSettings } from "@/lib/settings";
import type { Notification } from "@/lib/types";

const KIND: Record<Notification["kind"], { label: string; icon: LucideIcon; green: boolean }> = {
  replan: { label: "재계산 제안", icon: RotateCw, green: true },
  reminder: { label: "리마인더", icon: Clock, green: true },
  achieved: { label: "달성", icon: Check, green: false },
  missed: { label: "미달성", icon: CircleAlert, green: false },
};

export default function NotificationsPage() {
  const { settings } = useSettings();
  const hour = Number(settings.remindTime.split(":")[0]) || 21;
  const { data, error, reload } = useApi(() => api.notifications(hour), `noti-${hour}`);
  const actions = useTaskActions(reload);

  const groups: [string, Notification[]][] = [
    ["오늘", (data ?? []).filter((n) => n.day === "today")],
    ["어제", (data ?? []).filter((n) => n.day === "yesterday")],
  ];

  return (
    <main className="pb-10">
      <AppBar title="알림" />
      <div className="px-5">
        {error && <ErrorBox message={error} onRetry={reload} />}
        {data && data.length === 0 && <Empty>새 알림이 없어요</Empty>}
        {groups.map(
          ([label, items]) =>
            items.length > 0 && (
              <section key={label} className="mt-4">
                <h2 className="mb-3 text-[13px] text-text-sub">{label}</h2>
                <div className="space-y-3">
                  {items.map((n, i) => {
                    const k = KIND[n.kind];
                    const Icon = k.icon;
                    return (
                      <div key={i} className="glass-card flex gap-3 p-4">
                        <span
                          className={cx(
                            "flex size-10 shrink-0 items-center justify-center rounded-inner",
                            k.green ? "bg-primary-glass text-primary" : "bg-bg-regular text-icon-sub",
                          )}
                        >
                          <Icon size={20} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-[12px] text-text-sub-weak">
                            <span>{k.label}</span>
                            {n.time && <span>{n.time}</span>}
                          </div>
                          <p className="mt-1 text-[15px] font-semibold">{n.title}</p>
                          <p className="mt-0.5 text-[13px] text-text-sub">{n.body}</p>
                          {n.kind === "replan" && n.plan_id && (
                            <button
                              onClick={() => actions.openReplan(n.plan_id!)}
                              className="mt-3 rounded-full border border-glass-border-green bg-primary-glass px-4 py-2 text-[13px] font-semibold"
                            >
                              지금 재계산하기
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ),
        )}
      </div>
      {actions.sheets}
    </main>
  );
}
