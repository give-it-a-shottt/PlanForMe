"use client";

import { Bell, Clock, Moon, User } from "lucide-react";
import { useState } from "react";
import { Chip, ErrorBox, Toggle, TypeIcon, cx } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import { useSettings } from "@/lib/settings";

const USER_NAME = process.env.NEXT_PUBLIC_USER_NAME || "플래너";

export default function MyPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { data: s, error, reload } = useApi(() => api.stats(period), `stats-${period}`);
  const { settings, update } = useSettings();
  const diff = s ? s.rate - s.prev_rate : 0;
  const prevName = period === "week" ? "지난주" : "지난달";

  return (
    <main className="px-5 pt-8">
      <div className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full border border-glass-border-green bg-primary-glass text-primary">
          <User size={26} />
        </span>
        <div>
          <p className="text-[13px] text-text-sub">{s && s.streak > 0 ? `${s.streak}일 연속 달성 중` : "오늘도 한 걸음씩"}</p>
          <p className="text-[22px] font-semibold">{USER_NAME} 님</p>
        </div>
      </div>

      {error && (
        <div className="mt-5">
          <ErrorBox message={error} onRetry={reload} />
        </div>
      )}

      <section className="glass-card mt-6 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold">학습 통계</h2>
          <div className="flex gap-2">
            <Chip selected={period === "week"} onClick={() => setPeriod("week")}>
              주간
            </Chip>
            <Chip selected={period === "month"} onClick={() => setPeriod("month")}>
              월간
            </Chip>
          </div>
        </div>
        <p className="mt-4 text-[13px] text-text-sub">{period === "week" ? "이번 주 완수율" : "이번 달 완수율"}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-[40px] font-semibold text-primary">{s?.rate ?? 0}%</p>
          <p className="text-[12px] text-text-sub">
            {diff === 0 ? `${prevName}와 같아요` : `${prevName}보다 ${Math.abs(diff)}%p ${diff > 0 ? "올랐어요" : "내렸어요"}`}
          </p>
        </div>
        <div className="mt-4 flex h-32 items-end justify-between gap-2">
          {s?.bars.map((b) => (
            <div key={b.label} className="flex h-full flex-1 flex-col items-center gap-2">
              <div className="relative w-full max-w-7 flex-1 overflow-hidden rounded-full bg-primary-glass">
                <div
                  className={cx("absolute inset-x-0 bottom-0 rounded-full", b.is_current ? "bg-primary" : "bg-primary/40")}
                  style={{ height: `${b.rate}%` }}
                />
              </div>
              <span className={cx("text-[12px]", b.is_current ? "font-semibold" : "text-text-sub-weak")}>{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[17px] font-semibold">누적 학습량</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Total type="book" label="책" value={`${s?.book_pages ?? 0}p`} />
          <Total type="lecture" label="강의" value={`${s?.lectures ?? 0}강`} />
          <Total type="routine" label="일반" value={`${s?.routines ?? 0}회`} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-[17px] font-semibold">설정</h2>
        <div className="glass-card mt-3 divide-y divide-line-regular px-5">
          <SettingRow icon={<Moon size={22} />} label="다크모드">
            <Toggle label="다크모드" on={settings.dark} onChange={(dark) => update({ dark })} />
          </SettingRow>
          <SettingRow icon={<Bell size={22} />} label="알림 받기">
            <Toggle label="알림 받기" on={settings.push} onChange={(push) => update({ push })} />
          </SettingRow>
          <SettingRow icon={<Clock size={22} />} label="알림 시간">
            <label className="relative text-[14px] text-text-sub">
              매일 {settings.remindTime}
              <input
                type="time"
                aria-label="알림 시간"
                value={settings.remindTime}
                disabled={!settings.push}
                onChange={(e) => e.target.value && update({ remindTime: e.target.value })}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </SettingRow>
        </div>
        <p className="mt-2 px-1 text-[12px] text-text-sub-weak">알림은 앱 안의 알림 센터에 표시돼요. (푸시 알림은 준비 중)</p>
      </section>
    </main>
  );
}

function Total({ type, label, value }: { type: "book" | "lecture" | "routine"; label: string; value: string }) {
  return (
    <div className="glass-card rounded-inner! p-4">
      <TypeIcon type={type} />
      <p className="mt-3 text-[12px] text-text-sub">{label}</p>
      <p className="text-[18px] font-semibold">{value}</p>
    </div>
  );
}

function SettingRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="flex items-center gap-3 text-[15px]">
        <span className="text-icon-main">{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}
