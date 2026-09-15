import {
  getHabitsWithActivity,
  HabitList,
  type HabitWithActivity,
} from "@/components/dashboard/habit-list";
import { DashboardMotion } from "@/components/dashboard/dashboard-motion";
import { NewHabitForm } from "@/components/dashboard/new-habit-form";

const DashboardPage = async () => {
  let habits: HabitWithActivity[] = [];
  let fetchError = false;

  try {
    habits = await getHabitsWithActivity();
  } catch {
    fetchError = true;
  }

  const completedToday = habits.filter(
    (habit) => (habit.dailyCounts.at(-1)?.count ?? 0) >= habit.goal,
  ).length;
  const completion = habits.length
    ? Math.round(
        (habits.reduce((total, habit) => {
          const count = habit.dailyCounts.at(-1)?.count ?? 0;
          return total + Math.min(1, count / Math.max(habit.goal, 1));
        }, 0) /
          habits.length) *
          100,
      )
    : 0;

  return (
    <DashboardMotion>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <section
          data-dashboard-section
          className="rounded-2xl border border-card-border bg-card/85 p-5 shadow-section backdrop-blur sm:p-7"
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Today
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl">Make today count.</h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Keep the next small win visible. Log progress as you go and let
                consistency build from there.
              </p>
              <div className="mt-6">
                <NewHabitForm />
              </div>
            </div>

            <div className="rounded-xl border border-card-border/80 bg-background/70 p-5">
              <div className="flex items-end justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  Today&apos;s progress
                </p>
                <p className="text-4xl tracking-[-0.04em] text-foreground">
                  {completion}%
                </p>
              </div>
              <div className="mt-4 h-2 rounded-full bg-accent-0">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Goals met", value: `${completedToday}/${habits.length}` },
                  { label: "Active habits", value: habits.length },
                ].map((stat) => (
                  <article
                    key={stat.label}
                    data-overview-card
                    className="rounded-lg border border-card-border/80 bg-card/60 p-3"
                  >
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className="mt-1 text-xl text-foreground">{stat.value}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <HabitList habits={habits} fetchError={fetchError} />
      </main>
    </DashboardMotion>
  );
};

export default DashboardPage;
