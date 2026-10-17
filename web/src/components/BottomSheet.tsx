"use client";

// 디자인 코드라 설명 생략
import { useEffect, type ReactNode } from "react";

export function BottomSheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button aria-label="닫기" className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        className="relative w-full max-w-[440px] rounded-t-3xl border-t border-glass-border bg-glass-elevated px-5 pb-[max(env(safe-area-inset-bottom),24px)] pt-3 shadow-glass backdrop-blur-xl"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line-regular" />
        {children}
      </div>
    </div>
  );
}
