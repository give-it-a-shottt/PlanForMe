"use client";

// 디자인 코드라 설명 생략 (피그마 PlanForMe › Design_System 페이지의 Components 기준 공통 UI)
import { Book, Check, Repeat, SquarePlay, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { PlanType } from "@/lib/types";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type ButtonVariant = "primary" | "secondary" | "ghost";

/** Button XL 56 — Primary는 한 영역에 1개, 나머지는 Secondary · Ghost */
export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={cx(
        "h-14 w-full rounded-button text-[16px] font-semibold transition-colors duration-150 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-primary text-text-on-primary hover:bg-primary-hover active:bg-primary-pressed disabled:bg-bg-regular disabled:text-text-disabled",
        variant === "secondary" &&
          "bg-bg-regular text-text-main hover:bg-bg-hover active:bg-bg-pressed disabled:text-text-disabled",
        variant === "ghost" && "text-text-main hover:bg-bg-regular active:bg-bg-hover disabled:text-text-disabled",
        className,
      )}
    />
  );
}

/** Tag(필터 칩) — 선택되면 Filled(bg/inverse). 브랜드 색을 아끼는 선택 표시 */
export function Chip({ selected, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...props}
      className={cx(
        "h-9 shrink-0 rounded-full border px-4 text-[13px] transition-colors duration-150",
        selected
          ? "border-bg-inverse bg-bg-inverse font-semibold text-text-inverse"
          : "border-line-regular bg-bg-default text-text-sub hover:bg-bg-regular",
        className,
      )}
    />
  );
}

/** Checkbox L 24 — 누르는 영역은 44 */
export function Checkbox({ checked, onClick, label }: { checked: boolean; onClick?: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="-m-2.5 flex size-11 shrink-0 items-center justify-center rounded-button"
    >
      <span
        className={cx(
          "flex size-6 items-center justify-center rounded-[6px] border-[1.5px] transition-colors duration-100",
          checked ? "border-primary bg-primary text-icon-inverse" : "border-line-strong bg-bg-default",
        )}
      >
        {checked && <Check size={16} strokeWidth={3} />}
      </span>
    </button>
  );
}

/** Toggle A 52×28 — 누르는 즉시 적용될 때만 */
export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx("relative h-7 w-[52px] shrink-0 rounded-full transition-colors duration-100", on ? "bg-primary" : "bg-line-strong")}
    >
      <span
        className={cx(
          "absolute left-0.5 top-0.5 size-6 rounded-full bg-white shadow-1 transition-transform duration-100",
          on && "translate-x-6",
        )}
      />
    </button>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-bg-regular", className)}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Stepper({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div className="flex gap-1.5 px-5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={cx("h-1 flex-1 rounded-full", i < step ? "bg-primary" : "bg-line-regular")} />
      ))}
    </div>
  );
}

const TYPE_ICON: Record<PlanType, LucideIcon> = { book: Book, lecture: SquarePlay, routine: Repeat };

/** 카테고리 아이콘 박스 — 기본은 무채색, 선택(active)일 때만 브랜드 */
export function TypeIcon({ type, active, done, size = "md" }: { type: PlanType; active?: boolean; done?: boolean; size?: "md" | "lg" }) {
  const Icon = done ? Check : TYPE_ICON[type];
  return (
    <div
      className={cx(
        "flex shrink-0 items-center justify-center rounded-button",
        size === "lg" ? "size-12" : "size-11",
        active ? "bg-primary text-icon-inverse" : done ? "bg-bg-regular text-icon-disabled" : "bg-bg-regular text-icon-sub",
      )}
    >
      <Icon size={22} strokeWidth={done ? 2.5 : 1.8} />
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[14px] font-semibold text-text-main">{label}</span>
      {children}
    </label>
  );
}

/** Input XL 56 · Filled 스타일 — 포커스되면 bg/default + primary 선 + 헤일로 */
export const inputBox =
  "flex h-14 items-center rounded-input border border-transparent bg-bg-regular px-4 transition-colors duration-150 focus-within:border-primary focus-within:bg-bg-default focus-within:shadow-focus";

export function TextInput({ suffix, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { suffix?: string }) {
  return (
    <div className={cx(inputBox, className)}>
      <input
        {...props}
        className="h-full w-full min-w-0 bg-transparent text-[16px] text-text-main outline-none placeholder:text-text-sub-weak focus-visible:shadow-none"
      />
      {suffix && <span className="ml-2 shrink-0 text-[14px] text-text-sub-weak">{suffix}</span>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("card", className)}>{children}</div>;
}

/** Badge S 20 · Soft — brand(진행 중) · warning(덜 함) · gray(완료 · 보류) */
export function Badge({ tone = "brand", children }: { tone?: "brand" | "warning" | "gray"; children: ReactNode }) {
  return (
    <span
      className={cx(
        "inline-flex h-6 shrink-0 items-center rounded-tag px-2 text-[12px] font-medium",
        tone === "brand" && "bg-primary-soft text-primary-text",
        tone === "warning" && "bg-status-warning-bg text-status-warning-text",
        tone === "gray" && "bg-bg-regular text-text-sub",
      )}
    >
      {children}
    </span>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card flex items-center justify-between gap-3 p-4 text-[14px] text-text-sub">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="shrink-0 font-semibold text-text-main underline underline-offset-2">
          다시 시도
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="card p-6 text-center text-[14px] text-text-sub">{children}</div>;
}

export { cx };
