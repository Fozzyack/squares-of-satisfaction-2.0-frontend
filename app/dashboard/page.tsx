import { HabitList } from "@/components/dashboard/habit-list";
import { DashboardMotion } from "@/components/dashboard/dashboard-motion";
import { NewHabitForm } from "@/components/dashboard/new-habit-form";

const overviewCards = [
  { label: "Entries", value: "128" },
  { label: "Tiny wins", value: "47" },
  { label: "Habits", value: "14" },
];

const DashboardPage = () => {
  return (
    <DashboardMotion>
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
        <section
          data-dashboard-section
          className="rounded-2xl border border-card-border bg-card/80 p-5 shadow-[0_10px_28px_-24px_rgba(43,22,13,0.9)] backdrop-blur sm:p-7"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Overview
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {overviewCards.map((card) => (
              <article
                key={card.label}
                data-overview-card
                className="rounded-xl border border-card-border/80 bg-background/70 p-4"
              >
                <p className="text-sm text-muted">{card.label}</p>
                <p className="mt-1 text-2xl tracking-[-0.03em] text-foreground">
                  {card.value}
                </p>
              </article>
            ))}
          </div>
        </section>

        <NewHabitForm />

        <HabitList />
      </main>
    </DashboardMotion>
  );
};

export default DashboardPage;
