import { getBackendUrl } from "@/utils/env";
import { cookies } from "next/headers";

type Habit = {
    id: string;
    name: string;
    goal: number;
    increment: number;
    unit: string | null;
    color: string | null;
};

const LEVEL_CLASSES = [
    "bg-accent-0",
    "bg-accent-1",
    "bg-accent-2",
    "bg-accent-3",
    "bg-accent-4",
];

const HEATMAP_DAYS = 98;
const LEVEL_ALPHA = [0.16, 0.3, 0.44, 0.58, 0.72];

function hashSeed(id: string) {
    let hash = 0;
    for (let index = 0; index < id.length; index += 1) {
        hash = (hash << 5) - hash + id.charCodeAt(index);
        hash |= 0;
    }
    return Math.abs(hash % 360) / 360;
}

function buildHeatmap(seed: number, completion: number) {
    return Array.from({ length: HEATMAP_DAYS }, (_, index) => {
        const wave =
            Math.sin(index * 0.33 + seed * 1.7) +
            Math.cos(index * 0.11 + seed * 2.6) * 0.55 +
            completion / 100;
        const level = Math.max(
            0,
            Math.min(4, Math.floor((wave + 0.75) * 1.45)),
        );
        return level;
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

function HabitListItem({ habit }: { habit: Habit }) {
    const completion = Math.max(
        0,
        Math.min(
            100,
            Math.round((habit.increment / Math.max(habit.goal, 1)) * 100),
        ),
    );
    const activity = buildHeatmap(hashSeed(habit.id), completion);
    const goalSuffix = habit.unit ? ` ${habit.unit}` : "";

    return (
        <li className="rounded-xl border border-card-border bg-background/65 px-4 py-3">
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
                    +{habit.increment}
                    {goalSuffix}
                </span>
            </div>
            <div
                className="mt-3 grid auto-cols-[10px] grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1 md:auto-cols-[12px]"
                role="img"
                aria-label={`${habit.name} activity intensity heatmap`}
            >
                {activity.map((level, index) => (
                    (() => {
                        const squareColor = habit.color
                            ? hexToRgba(habit.color, LEVEL_ALPHA[level])
                            : null;

                        return (
                            <span
                                key={`${habit.id}-${index}`}
                                className={`h-[10px] w-[10px] rounded-[3px] border border-card-border/70 md:h-[12px] md:w-[12px] ${squareColor ? "" : LEVEL_CLASSES[level]}`}
                                style={squareColor ? { backgroundColor: squareColor } : undefined}
                                aria-hidden="true"
                            />
                        );
                    })()
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-sm text-muted">
                <p>Progress increments toward goal</p>
                <p className="font-mono text-xs uppercase tracking-[0.12em]">
                    {completion}% of goal
                </p>
            </div>
        </li>
    );
}

async function getHabits() {
    const cookieStore = await cookies();
    const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME ?? "tiny-wins";
    const sessionCookie = cookieStore.get(cookieName);

    if (!sessionCookie) {
        return [] as Habit[];
    }

    const response = await fetch(`${getBackendUrl()}/habits`, {
        cache: "no-store",
        headers: {
            Cookie: `${sessionCookie.name}=${sessionCookie.value}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch habits");
    }

    return data as Habit[];
}

export async function HabitList() {
    let habits: Habit[] = [];
    let fetchError = false;

    try {
        habits = await getHabits();
    } catch {
        fetchError = true;
    }

    return (
        <section className="rounded-2xl border border-card-border bg-card/85 p-5 sm:p-7">
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
