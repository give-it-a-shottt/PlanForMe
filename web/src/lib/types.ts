export type PlanType = "book" | "lecture" | "routine";
export type PlanStatus = "active" | "done" | "paused";

export interface PlanInput {
  type: PlanType;
  title: string;
  start_date: string;
  end_date: string;
  weekdays: number[];
  current_page?: number;
  last_page?: number;
  total_lectures?: number;
  avg_minutes?: number;
}

export interface ScheduleItem {
  date: string;
  target_start: number | null;
  target_end: number | null;
  amount: number;
}

export interface Preview {
  valid_days: number;
  total_amount: number;
  daily_amount: number;
  last_day_amount: number;
  daily_minutes: number | null;
  overload: boolean;
  extend_weeks: number | null;
  extend_daily: number | null;
  first_week: ScheduleItem[];
}

export interface Plan {
  id: number;
  type: PlanType;
  title: string;
  start_date: string;
  end_date: string;
  weekdays: number[];
  status: PlanStatus;
  start_unit: number | null;
  end_unit: number | null;
  avg_minutes: number | null;
  daily_amount: number;
  position: number | null;
  done_amount: number;
  total_amount: number;
  progress: number;
  remaining_amount: number;
  remaining_days: number;
  d_day: number;
}

export interface Task {
  id: number;
  plan_id: number;
  plan_type: PlanType;
  plan_title: string;
  date: string;
  target_start: number | null;
  target_end: number | null;
  target_amount: number;
  actual_end: number | null;
  done: boolean;
  completed_at: string | null;
  avg_minutes: number | null;
  routine_index: number | null;
  routine_total: number | null;
}

export interface PlanDetail extends Plan {
  records: Task[];
}

export interface ReplanSuggestion {
  plan_id: number;
  plan_type: PlanType;
  plan_title: string;
  remaining_amount: number;
  remaining_days: number;
  current_daily: number;
  new_daily: number;
  start_from: string;
  end_date: string;
  weekdays: number[];
}

export interface CompleteResult {
  task: Task;
  diff: number | null;
  suggestion: ReplanSuggestion | null;
}

export interface Overdue {
  plan_id: number;
  plan_type: PlanType;
  plan_title: string;
  target_start: number | null;
  target_end: number | null;
  target_amount: number;
}

export interface Today {
  date: string;
  tasks: Task[];
  done_count: number;
  total_count: number;
  overdue: Overdue[];
}

export interface Notification {
  kind: "replan" | "reminder" | "achieved" | "missed";
  day: "today" | "yesterday";
  title: string;
  body: string;
  time: string | null;
  plan_id: number | null;
}

export interface Stats {
  period: "week" | "month";
  rate: number;
  prev_rate: number;
  bars: { label: string; rate: number; is_current: boolean }[];
  book_pages: number;
  lectures: number;
  routines: number;
  streak: number;
}
