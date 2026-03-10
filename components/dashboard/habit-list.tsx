import { getBackendUrl } from "@/utils/env";
import { cookies } from "next/headers";
import { HabitListClient } from "@/components/dashboard/habit-list-client";

export type Habit = {
    id: string;
    name: string;
    goal: number;
    increment: number;
    unit: string | null;
    color: string | null;
};

export type HabitDailyCount = {
    date: string;
    count: number;
};

export type HabitWithActivity = Habit & {
    dailyCounts: HabitDailyCount[];
};

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
                <HabitListClient habits={habits} />
            )}
        </section>
    );
}
