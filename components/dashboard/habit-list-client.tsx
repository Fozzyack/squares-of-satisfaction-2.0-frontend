"use client";

import { HabitRecordButton } from "@/components/dashboard/habit-record-button";
import { getBackendUrl } from "@/utils/env";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { HabitWithActivity } from "@/components/dashboard/habit-list";

type HabitLog = {
  id: string;
  increment_amount: number;
  habit_id: string;
  user_id: string;
  date: string;
  created_at: string;
};

type HeatmapDay = {
  date: string;
  count: number;
  level: number;
};

const LEVEL_CLASSES = [
  "bg-accent-0",
  "bg-accent-1",
  "bg-accent-2",
  "bg-accent-3",
  "bg-accent-4",
];

const HEATMAP_DAYS = 365;
const LEVEL_ALPHA = [0.16, 0.3, 0.44, 0.58, 0.72];
const DRAWER_ANIMATION_MS = 260;

function mapCountToLevel(count: number, goal: number) {
  if (count <= 0) {
    return 0;
  }

  const safeGoal = Math.max(goal, 1);
  return Math.max(1, Math.min(4, Math.ceil((count / safeGoal) * 4)));
}

function toDateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toDayMonthLabel(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return `${date.getUTCDate()} ${date.toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  })}`;
}

function toLongDateLabel(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function toTimeLabel(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildHeatmap(dailyCounts: HabitWithActivity["dailyCounts"], goal: number) {
  const countByDay = new Map(
    dailyCounts.map((entry) => [entry.date.slice(0, 10), entry.count]),
  );
  const today = new Date();

  return Array.from({ length: HEATMAP_DAYS }, (_, index): HeatmapDay => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (HEATMAP_DAYS - 1 - index));
    const dateKey = toDateKey(date);
    const count = countByDay.get(dateKey) ?? 0;

    return {
      date: dateKey,
      count,
      level: mapCountToLevel(count, goal),
    };
  });
}

function hexToRgba(hex: string, alpha: number) {
  const isHexColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
  if (!isHexColor) {
    return null;
  }

  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const numeric = Number.parseInt(normalized.slice(1), 16);
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

type HabitListClientProps = {
  habits: HabitWithActivity[];
};

type HabitListItemProps = {
  habit: HabitWithActivity;
  onSquareClick: (habit: HabitWithActivity, date: string) => void;
  onSettingsClick: (habit: HabitWithActivity) => void;
};

function HabitListItem({
  habit,
  onSquareClick,
  onSettingsClick,
}: HabitListItemProps) {
  const todayCount = habit.dailyCounts.at(-1)?.count ?? 0;
  const completion = Math.max(
    0,
    Math.min(100, Math.round((todayCount / Math.max(habit.goal, 1)) * 100)),
  );
  const activity = buildHeatmap(habit.dailyCounts, habit.goal);
  const goalSuffix = habit.unit ? ` ${habit.unit}` : "";

  return (
    <li
      data-habit-item
      className="rounded-xl border border-card-border bg-background/65 px-4 py-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] leading-tight text-foreground">{habit.name}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
            Daily goal: {habit.goal}
            {goalSuffix}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent-2/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
            Today: {todayCount}
            {goalSuffix}
          </span>
          <button
            type="button"
            onClick={() => onSettingsClick(habit)}
            className="rounded-lg border border-card-border bg-background/70 px-2.5 py-1 text-xs text-foreground transition hover:bg-background"
          >
            Delete
          </button>
        </div>
      </div>

      <div
        data-habit-grid
        className="mt-3 grid auto-cols-[10px] grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1 md:auto-cols-[12px]"
        role="group"
        aria-label={`${habit.name} activity intensity heatmap`}
      >
        {activity.map((entry, index) => {
          const squareColor = habit.color
            ? hexToRgba(habit.color, LEVEL_ALPHA[entry.level])
            : null;
          const unitLabel = habit.unit ?? "times";

          return (
            <button
              key={`${habit.id}-${index}`}
              type="button"
              onClick={() => onSquareClick(habit, entry.date)}
              className={`h-[10px] w-[10px] rounded-[3px] border border-card-border/70 transition-transform duration-150 ease-out hover:scale-125 focus-visible:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:h-[12px] md:w-[12px] ${squareColor ? "" : LEVEL_CLASSES[entry.level]}`}
              style={squareColor ? { backgroundColor: squareColor } : undefined}
              title={`${entry.count} ${unitLabel} on ${toDayMonthLabel(entry.date)}`}
              aria-label={`${habit.name}: ${entry.count} ${unitLabel} on ${toDayMonthLabel(entry.date)}. Show logs.`}
            />
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-sm text-muted">
        <p>Progress increments toward goal</p>
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.12em]">
            Today: {completion}% of goal
          </p>
          <HabitRecordButton
            habitId={habit.id}
            increment={habit.increment}
            unit={habit.unit}
            color={habit.color}
          />
        </div>
      </div>
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <p>
            {todayCount} / {habit.goal}
            {goalSuffix}
          </p>
          <p>{completion}% complete</p>
        </div>
        <div className="h-2 w-full rounded-full bg-accent-0">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${completion}%`,
              backgroundColor: habit.color ?? "var(--color-accent-3)",
            }}
          />
        </div>
      </div>
    </li>
  );
}

export function HabitListClient({ habits }: HabitListClientProps) {
  const router = useRouter();
  const [selectedHabit, setSelectedHabit] = useState<HabitWithActivity | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [settingsHabit, setSettingsHabit] = useState<HabitWithActivity | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDeletingHabit, setIsDeletingHabit] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState("");

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const drawerTitle = useMemo(() => {
    if (!selectedHabit || !selectedDate) {
      return "Habit logs";
    }

    return `${selectedHabit.name} - ${toLongDateLabel(selectedDate)}`;
  }, [selectedHabit, selectedDate]);

  useEffect(() => {
    if (isDrawerOpen || (!selectedHabit && !selectedDate)) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSelectedHabit(null);
      setSelectedDate(null);
      setLogs([]);
      setLogsError("");
    }, DRAWER_ANIMATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isDrawerOpen, selectedHabit, selectedDate]);

  useEffect(() => {
    if (!selectedHabit || !selectedDate) {
      return;
    }

    let isActive = true;

    const fetchLogs = async () => {
      setIsLoadingLogs(true);
      setLogsError("");

      try {
        const response = await fetch(
          `${getBackendUrl()}/habits/logs?date=${encodeURIComponent(selectedDate)}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          if (!isActive) {
            return;
          }
          setLogsError(data?.error ?? "Could not load logs");
          setLogs([]);
          return;
        }

        const allLogs = (await response.json()) as HabitLog[];
        if (!isActive) {
          return;
        }

        setLogs(allLogs.filter((entry) => entry.habit_id === selectedHabit.id));
      } catch {
        if (!isActive) {
          return;
        }
        setLogsError("Could not reach server");
        setLogs([]);
      } finally {
        if (isActive) {
          setIsLoadingLogs(false);
        }
      }
    };

    fetchLogs();

    return () => {
      isActive = false;
    };
  }, [selectedHabit, selectedDate]);

  useEffect(() => {
    if (!isSettingsModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSettingsModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isSettingsModalOpen]);

  useEffect(() => {
    if (isSettingsModalOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSettingsHabit(null);
      setIsDeletingHabit(false);
    }, 120);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isSettingsModalOpen]);

  const openSettingsModal = (habit: HabitWithActivity) => {
    setSettingsHabit(habit);
    setDeleteError("");
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    if (isDeletingHabit) {
      return;
    }

    setIsSettingsModalOpen(false);
  };

  const handleDeleteHabit = async (habitId: string) => {
    if (isDeletingHabit) {
      return;
    }

    setIsDeletingHabit(true);
    setDeleteError("");

    let didDelete = false;

    try {
      const response = await fetch(`${getBackendUrl()}/habits/${habitId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setDeleteError(data?.error ?? "Could not delete habit");
        return;
      }

      didDelete = true;
    } catch {
      setDeleteError("Could not reach server");
    } finally {
      setIsDeletingHabit(false);

      if (didDelete) {
        setIsSettingsModalOpen(false);
        router.refresh();
      }
    }
  };

  return (
    <>
      <ul className="mt-5 space-y-3">
        {habits.map((habit) => (
          <HabitListItem
            key={habit.id}
            habit={habit}
            onSquareClick={(clickedHabit, date) => {
              setSelectedHabit(clickedHabit);
              setSelectedDate(date);
              setIsDrawerOpen(true);
            }}
            onSettingsClick={openSettingsModal}
          />
        ))}
      </ul>

      {settingsHabit && isSettingsModalOpen ? (
        <div
          className="fixed inset-0 z-[120] flex items-start justify-center bg-[#2b160d]/40 p-4 pt-10 backdrop-blur-sm sm:items-center sm:pt-4"
          onClick={closeSettingsModal}
        >
          <section
            className="w-full max-w-md rounded-2xl border border-card-border bg-card p-5 shadow-[0_28px_58px_-28px_rgba(43,22,13,0.88)] sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Settings for ${settingsHabit.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  Habit settings
                </p>
                <h4 className="mt-2 text-xl text-foreground">{settingsHabit.name}</h4>
              </div>
              <button
                type="button"
                onClick={closeSettingsModal}
                className="rounded-full border border-card-border bg-background/70 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-muted transition hover:text-foreground"
              >
                Close
              </button>
            </div>

            <p className="mt-4 text-sm text-muted">
              Delete permanently removes this habit and all of its history.
            </p>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeSettingsModal}
                disabled={isDeletingHabit}
                className="rounded-full border border-card-border bg-background/70 px-4 py-2 text-sm text-foreground transition hover:bg-background"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteHabit(settingsHabit.id)}
                disabled={isDeletingHabit}
                className="rounded-full bg-[#8d3212] px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-px hover:bg-[#7a2c10] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isDeletingHabit ? "Deleting..." : "Delete habit"}
              </button>
            </div>
            {deleteError ? (
              <p className="mt-3 rounded-xl border border-[#efc2a8] bg-[#ffe6d9] px-3 py-2 text-sm text-[#8d3212]" role="alert">
                {deleteError}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}

      {selectedHabit && selectedDate && portalRoot
        ? createPortal(
            <aside
              className={`fixed right-0 top-0 z-[100] h-dvh w-full max-w-md border-l border-card-border bg-card p-5 shadow-[-12px_0_28px_-20px_rgba(43,22,13,0.85)] transition-transform duration-300 ease-out sm:p-6 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                    Daily logs
                  </p>
                  <h4 className="mt-1 text-lg text-foreground">{drawerTitle}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                  }}
                  className="rounded-lg border border-card-border bg-background/70 px-2.5 py-1 text-sm text-foreground transition hover:bg-background"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 space-y-3 overflow-y-auto pr-1">
                {isLoadingLogs ? (
                  <p className="text-sm text-muted">Loading logs...</p>
                ) : logsError ? (
                  <p className="rounded-xl border border-[#efc2a8] bg-[#ffe6d9] px-3 py-2 text-sm text-[#8d3212]">
                    {logsError}
                  </p>
                ) : logs.length === 0 ? (
                  <p className="text-sm text-muted">No logs for this habit on that day.</p>
                ) : (
                  logs.map((log) => (
                    <article
                      key={log.id}
                      className="rounded-xl border border-card-border bg-background/70 px-3 py-2"
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                        {toTimeLabel(log.created_at)}
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        +{log.increment_amount}
                        {selectedHabit.unit ? ` ${selectedHabit.unit}` : ""}
                      </p>
                    </article>
                  ))
                )}
              </div>
            </aside>,
            portalRoot,
          )
        : null}
    </>
  );
}
