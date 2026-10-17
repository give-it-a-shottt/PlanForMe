"use client";

// 디자인 코드라 설명 생략 (Figma Components 페이지 기준 공통 UI)
import { Book, Check, Repeat, SquarePlay, type LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { PlanType } from "@/lib/types";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type ButtonVariant = "primary" | "outline" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={cx(
        "h-14 w-full rounded-inner text-[15px] font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-primary text-white shadow-primary hover:bg-primary-hover disabled:bg-bg-regular disabled:text-text-disabled disabled:shadow-none",
        variant === "outline" && "border border-line-regular bg-glass-elevated text-text-main disabled:text-text-disabled",
        variant === "ghost" && "text-text-main disabled:text-text-disabled",
        className,
      )}
    />
  );
}

export function Chip({ selected, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        "h-9 shrink-0 rounded-full border px-4 text-[13px] transition",
        selected
          ? "border-glass-border-green bg-primary-glass font-semibold text-text-main"
          : "border-line-regular bg-glass-elevated text-text-sub",
        className,
      )}
    />
  );
}

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
      className={cx(
        "flex size-7 shrink-0 items-center justify-center rounded-lg border transition",
        checked ? "border-primary bg-primary text-white" : "border-line-regular bg-bg-default",
      )}
    >
      {checked && <Check size={16} strokeWidth={3} />}
    </button>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx("relative h-7 w-12 rounded-full transition", on ? "bg-primary" : "bg-line-regular")}
    >
      <span
        className={cx(
          "absolute top-0.5 size-6 rounded-full bg-white shadow transition-all",
          on ? "left-[22px]" : "left-0.5",
        )}
      />
    </button>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-primary-glass", className)}>
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

export function TypeIcon({ type, active, done, size = "md" }: { type: PlanType; active?: boolean; done?: boolean; size?: "md" | "lg" }) {
  const Icon = done ? Check : TYPE_ICON[type];
  return (
    <div
      className={cx(
        "flex shrink-0 items-center justify-center rounded-inner",
        size === "lg" ? "size-12" : "size-11",
        active || done ? "bg-primary text-white" : "bg-primary-glass text-primary",
      )}
    >
      <Icon size={22} strokeWidth={done ? 3 : 1.8} />
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-medium text-text-main">{label}</span>
      {children}
    </label>
  );
}

export function TextInput({ suffix, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { suffix?: string }) {
  return (
    <div
      className={cx(
        "flex h-14 items-center rounded-inner border border-line-regular bg-glass-elevated px-4 transition focus-within:border-primary",
        className,
      )}
    >
      <input
        {...props}
        className="h-full w-full min-w-0 bg-transparent text-[15px] text-text-main outline-none placeholder:text-text-disabled"
      />
      {suffix && <span className="ml-2 shrink-0 text-[14px] text-text-sub-weak">{suffix}</span>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx("glass-card", className)}>{children}</div>;
}

export function Badge({ tone = "green", children }: { tone?: "green" | "yellow" | "gray"; children: ReactNode }) {
  return (
    <span
      className={cx(
        "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold",
        tone === "green" && "bg-primary-soft text-text-main",
        tone === "yellow" && "bg-[#FFF4D6] text-[#8A5A00]",
        tone === "gray" && "bg-bg-regular text-text-sub",
      )}
    >
      {children}
    </span>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="glass-card flex items-center justify-between gap-3 p-4 text-[14px] text-text-sub">
      <span>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="shrink-0 font-semibold text-primary">
          다시 시도
        </button>
      )}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="glass-card p-6 text-center text-[14px] text-text-sub-weak">{children}</div>;
}

export { cx };
