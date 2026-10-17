"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SETTINGS_KEY as KEY } from "./theme";

// 1인용 앱이라 설정은 이 브라우저(localStorage)에만 저장한다
export interface Settings {
  dark: boolean;
  push: boolean;
  remindTime: string;
}

const DEFAULTS: Settings = { dark: false, push: true, remindTime: "21:00" };
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: Settings } = { raw: null, value: DEFAULTS };

function read(): Settings {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return DEFAULTS;
  }
  if (raw !== cache.raw) {
    try {
      cache = { raw, value: raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS };
    } catch {
      cache = { raw, value: DEFAULTS };
    }
  }
  return cache.value;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function useSettings() {
  const settings = useSyncExternalStore(subscribe, read, () => DEFAULTS);
  const update = useCallback((patch: Partial<Settings>) => {
    const next = { ...read(), ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* 저장할 수 없는 환경이면 이번 화면에서만 반영 */
    }
    if (patch.dark !== undefined) applyTheme(next.dark);
    listeners.forEach((l) => l());
  }, []);
  return { settings, update };
}
