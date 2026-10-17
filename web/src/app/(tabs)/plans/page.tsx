"use client";

import Link from "next/link";
import { useState } from "react";
import { PlanCard } from "@/components/PlanCard";
import { Chip, Empty, ErrorBox } from "@/components/ui";
import { api, useApi } from "@/lib/api";
import type { PlanStatus } from "@/lib/types";

const FILTERS: { key: PlanStatus; label: string }[] = [
  { key: "active", label: "진행 중" },
  { key: "done", label: "완료" },
  { key: "paused", label: "보류" },
];

export default function PlansPage() {
  const { data, error, reload } = useApi(api.plans, "plans");
  const [status, setStatus] = useState<PlanStatus>("active");
  const count = (s: PlanStatus) => data?.filter((p) => p.status === s).length ?? 0;
  const plans = data?.filter((p) => p.status === status) ?? [];

  return (
    <main className="px-5 pt-8">
      <p className="text-[14px] text-text-sub">{count("active")}개 진행 중</p>
      <h1 className="mt-1 text-[24px] font-semibold">내 플랜</h1>

      <div className="mt-5 flex gap-2">
        {FILTERS.map((f) => (
          <Chip key={f.key} selected={status === f.key} onClick={() => setStatus(f.key)}>
            {f.label} {count(f.key)}
          </Chip>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {error && <ErrorBox message={error} onRetry={reload} />}
        {data && plans.length === 0 && (
          <Empty>
            {status === "active" ? (
              <>
                진행 중인 플랜이 없어요.
                <br />
                <Link href="/new" className="font-semibold text-primary">
                  + 새 플랜 만들기
                </Link>
              </>
            ) : (
              `${FILTERS.find((f) => f.key === status)?.label} 플랜이 없어요`
            )}
          </Empty>
        )}
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} />
        ))}
      </div>
    </main>
  );
}
