"use client";

// 디자인 코드라 설명 생략 (날짜 · 수행 요일 입력)
import { fmtMonthDay, WEEKDAY_MON_FIRST } from "@/lib/format";
import { Chip, cx } from "./ui";

export function DateField({ label, value, min, onChange }: { label: string; value: string; min?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <span className="mb-2 block text-[13px] font-medium">{label}</span>
      <div className="relative flex h-14 items-center rounded-inner border border-line-regular bg-glass-elevated px-4 text-[15px]">
        {value ? fmtMonthDay(value) : "날짜 선택"}
        <input
          type="date"
          aria-label={label}
          value={value}
          min={min}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}

const PRESETS: { label: string; days: number[] | null }[] = [
  { label: "매일", days: [0, 1, 2, 3, 4, 5, 6] },
  { label: "평일", days: [0, 1, 2, 3, 4] },
  { label: "주말", days: [5, 6] },
  { label: "직접 선택", days: null },
];

const same = (a: number[], b: number[]) => a.length === b.length && [...a].sort().every((v, i) => v === b[i]);

export function WeekdayPicker({ value, onChange }: { value: number[]; onChange: (v: number[]) => void }) {
  const matched = PRESETS.find((p) => p.days && same(value, p.days));
  return (
    <div>
      <span className="mb-2 block text-[13px] font-medium">수행 요일</span>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Chip
            key={p.label}
            selected={p.days ? matched === p : !matched}
            onClick={() => p.days && onChange(p.days)}
          >
            {p.label}
          </Chip>
        ))}
      </div>
      <div className="mt-3 flex justify-between">
        {WEEKDAY_MON_FIRST.map((name, i) => {
          const on = value.includes(i);
          return (
            <button
              key={name}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((d) => d !== i) : [...value, i].sort())}
              className={cx(
                "size-11 rounded-full text-[14px] font-medium transition",
                on ? "bg-primary text-white" : "bg-glass-elevated text-text-sub",
              )}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
