"use client";

// 디자인 코드라 설명 생략
import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function AppBar({
  title,
  icon = "back",
  onBack,
  right,
}: {
  title: string;
  icon?: "back" | "close";
  onBack?: () => void;
  right?: ReactNode;
}) {
  const router = useRouter();
  const Icon = icon === "close" ? X : ChevronLeft;
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between px-3 backdrop-blur-md">
      <button
        aria-label={icon === "close" ? "닫기" : "뒤로"}
        onClick={onBack ?? (() => (window.history.length > 1 ? router.back() : router.push("/")))}
        className="flex size-10 items-center justify-center text-icon-main"
      >
        <Icon size={24} />
      </button>
      <h1 className="text-[17px] font-semibold">{title}</h1>
      <div className="flex size-10 items-center justify-center">{right}</div>
    </header>
  );
}
