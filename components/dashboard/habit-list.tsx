import { getBackendUrl } from "@/utils/env";
import { cookies } from "next/headers";
import { HabitRecordButton } from "@/components/dashboard/habit-record-button";

type Habit = {
    id: string;
    name: string;
    goal: number;
    increment: number;
    unit: string | null;
    color: string | null;
};

type HabitDailyCount = {
    date: string;
    count: number;
};

type HabitWithActivity = Habit & {
    dailyCounts: HabitDailyCount[];
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

function buildHeatmap(dailyCounts: HabitDailyCount[], goal: number) {
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

function HabitListItem({ habit }: { habit: HabitWithActivity }) {
    const todayCount = habit.dailyCounts.at(-1)?.count ?? 0;
    const completion = Math.max(
        0,
        Math.min(
            100,
            Math.round((todayCount / Math.max(habit.goal, 1)) * 100),
        ),
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
                    <p className="text-[15px] leading-tight text-foreground">
                        {habit.name}
                    </p>
                    <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
                        Daily goal: {habit.goal}
                        {goalSuffix}
                    </p>
                </div>
                <span className="rounded-full bg-accent-2/35 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
                    Today: {todayCount}
                    {goalSuffix}
                </span>
            </div>
            <div
                data-habit-grid
                className="mt-3 grid auto-cols-[10px] grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1 md:auto-cols-[12px]"
                role="img"
                aria-label={`${habit.name} activity intensity heatmap`}
            >
                {activity.map((entry, index) => (
                    (() => {
                        const squareColor = habit.color
                            ? hexToRgba(habit.color, LEVEL_ALPHA[entry.level])
                            : null;
                        const unitLabel = habit.unit ?? "times";

                        return (
                            <div
                                key={`${habit.id}-${index}`}
                                className={`h-[10px] w-[10px] rounded-[3px] border border-card-border/70 transition-transform duration-150 ease-out hover:scale-125 md:h-[12px] md:w-[12px] ${squareColor ? "" : LEVEL_CLASSES[entry.level]}`}
                                style={squareColor ? { backgroundColor: squareColor } : undefined}
                                title={`${entry.count} ${unitLabel} on ${toDayMonthLabel(entry.date)}`}
                                aria-hidden="true"
                            />
                        );
                    })()
                ))}
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

async function getHabitsWithActivity() {
    const cookieStore = await cookies();
    const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME ?? "tiny-wins";
    const sessionCookie = cookieStore.get(cookieName);

    if (!sessionCookie) {
        return [] as HabitWithActivity[];
    }

    const cookieHeader = `${sessionCookie.name}=${sessionCookie.value}`;

    const response = await fetch(`${getBackendUrl()}/habits`, {
        cache: "no-store",
        headers: {
            Cookie: cookieHeader,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch habits");
    }

    const habits = data as Habit[];

    const habitsWithActivity = await Promise.all(
        habits.map(async (habit) => {
            try {
                const recordsResponse = await fetch(
                    `${getBackendUrl()}/habits/${habit.id}/records`,
                    {
                        cache: "no-store",
                        headers: {
                            Cookie: cookieHeader,
                        },
                    },
                );

                if (!recordsResponse.ok) {
                    return {
                        ...habit,
                        dailyCounts: [] as HabitDailyCount[],
                    };
                }

                const dailyCounts = (await recordsResponse.json()) as HabitDailyCount[];

                return {
                    ...habit,
                    dailyCounts,
                };
            } catch {
                return {
                    ...habit,
                    dailyCounts: [] as HabitDailyCount[],
                };
            }
        }),
    );

    return habitsWithActivity;
}

export async function HabitList() {
    let habits: HabitWithActivity[] = [];
    let fetchError = false;

    try {
        habits = await getHabitsWithActivity();
    } catch {
        fetchError = true;
    }

    return (
        <section
            data-dashboard-section
            className="rounded-2xl border border-card-border bg-card/85 p-5 sm:p-7"
        >
            <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl">Habits</h3>
                <span className="rounded-full bg-accent-1/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-foreground">
                    {habits.length} total
                </span>
            </div>

            {fetchError ? (
                <p className="mt-4 rounded-xl border border-[#efc2a8] bg-[#ffe6d9] px-3 py-2 text-sm text-[#8d3212]">
                    We could not load your habits right now.
                </p>
            ) : habits.length === 0 ? (
                <p className="mt-4 text-sm text-muted">
                    No habits yet. Create one to get started.
                </p>
            ) : (
                <ul className="mt-5 space-y-3">
                    {habits.map((habit) => (
                        <HabitListItem key={habit.id} habit={habit} />
                    ))}
                </ul>
            )}
        </section>
    );
}
