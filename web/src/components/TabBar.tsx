"use client";

// 디자인 코드라 설명 생략
import { Calendar, House, List, Plus, User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

const TABS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "홈", icon: House },
  { href: "/calendar", label: "캘린더", icon: Calendar },
  { href: "/plans", label: "플랜", icon: List },
  { href: "/my", label: "마이", icon: User },
];

function Tab({ href, label, icon: Icon, active }: (typeof TABS)[number] & { active: boolean }) {
  return (
    <Link
      href={href}
      className={cx(
        "flex w-14 flex-col items-center gap-1 text-[11px]",
        active ? "font-semibold text-primary" : "text-icon-sub-weak",
      )}
    >
      <Icon size={24} strokeWidth={1.8} />
      <span className={active ? "text-text-main" : ""}>{label}</span>
    </Link>
  );
}

export function TabBar() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[440px] rounded-t-3xl border-t border-glass-border bg-glass-elevated pb-[max(env(safe-area-inset-bottom),12px)] pt-3 shadow-glass backdrop-blur-xl">
      <div className="flex items-center justify-around px-2">
        <Tab {...TABS[0]} active={isActive(TABS[0].href)} />
        <Tab {...TABS[1]} active={isActive(TABS[1].href)} />
        <Link
          href="/new"
          aria-label="새 플랜 만들기"
          className="-mt-1 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-primary"
        >
          <Plus size={28} />
        </Link>
        <Tab {...TABS[2]} active={isActive(TABS[2].href)} />
        <Tab {...TABS[3]} active={isActive(TABS[3].href)} />
      </div>
    </nav>
  );
}
