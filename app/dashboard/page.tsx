const overviewCards = [
  { label: "Entries", value: "128" },
  { label: "Tiny wins", value: "47" },
  { label: "Habits", value: "14" },
];

const recentEntries = [
  { title: "Morning walk", time: "Today 07:30", status: "logged" },
  { title: "Read 10 pages", time: "Today 12:15", status: "logged" },
  { title: "Strength training", time: "Thu 18:00", status: "weekly" },
  { title: "Journal reflection", time: "Sun 20:30", status: "scheduled" },
];

const DashboardPage = () => {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 sm:pt-8 lg:px-8">
      <section className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]/80 p-5 shadow-[0_10px_28px_-24px_rgba(43,22,13,0.9)] backdrop-blur sm:p-7">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Overview
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {overviewCards.map((card) => (
            <article
              key={card.label}
              className="rounded-xl border border-[var(--color-card-border)]/80 bg-[var(--color-background)]/70 p-4"
            >
              <p className="text-sm text-[var(--color-muted)]">{card.label}</p>
              <p className="mt-1 text-2xl tracking-[-0.03em] text-[var(--color-foreground)]">
                {card.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]/85 p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-2xl">Recent entries</h3>
            <span className="rounded-full bg-[var(--color-accent-1)]/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-foreground)]">
              3 this week
            </span>
          </div>
          <ul className="mt-5 space-y-3">
            {recentEntries.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-2 rounded-xl border border-[var(--color-card-border)] bg-[var(--color-background)]/65 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-[15px] leading-tight">{item.title}</p>
                  <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">
                    {item.time}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${
                    item.status === "logged"
                      ? "bg-[var(--color-accent-2)]/35 text-[var(--color-foreground)]"
                      : item.status === "weekly"
                        ? "bg-[var(--color-accent-1)]/45 text-[var(--color-foreground)]"
                        : "bg-[var(--color-accent-0)] text-[var(--color-muted)]"
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <aside className="rounded-2xl border border-[var(--color-card-border)] bg-[var(--color-card)]/85 p-5 sm:p-7">
          <h3 className="text-2xl">Momentum</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            You&apos;re strongest in the morning. Keep your biggest task before lunch.
          </p>
          <div className="mt-5 space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                <span>Morning</span>
                <span>92%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-accent-0)]">
                <div className="h-full w-[92%] rounded-full bg-[var(--color-accent-4)]" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                <span>Afternoon</span>
                <span>74%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-accent-0)]">
                <div className="h-full w-[74%] rounded-full bg-[var(--color-accent-3)]" />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                <span>Evening</span>
                <span>61%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-accent-0)]">
                <div className="h-full w-[61%] rounded-full bg-[var(--color-accent-2)]" />
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default DashboardPage;
