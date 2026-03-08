type Habit = {
  id: string;
  name: string;
  cadence: string;
  streak: string;
  completion: number;
  seed: number;
  status: "on-track" | "needs-attention";
};

const LEVEL_CLASSES = [
  "bg-accent-0",
  "bg-accent-1",
  "bg-accent-2",
  "bg-accent-3",
  "bg-accent-4",
];

const HEATMAP_DAYS = 98;

const mockHabits: Habit[] = [
  {
    id: "water",
    name: "Drink 8 cups of water",
    cadence: "Daily",
    streak: "12 day streak",
    completion: 75,
    seed: 0.42,
    status: "on-track",
  },
  {
    id: "walk",
    name: "Morning walk",
    cadence: "Weekdays",
    streak: "5 day streak",
    completion: 60,
    seed: 0.83,
    status: "on-track",
  },
  {
    id: "read",
    name: "Read 10 pages",
    cadence: "Daily",
    streak: "3 day streak",
    completion: 40,
    seed: 1.17,
    status: "needs-attention",
  },
  {
    id: "journal",
    name: "Journal reflection",
    cadence: "4x per week",
    streak: "1 day streak",
    completion: 20,
    seed: 1.51,
    status: "needs-attention",
  },
];

function buildHeatmap(seed: number, completion: number) {
  return Array.from({ length: HEATMAP_DAYS }, (_, index) => {
    const wave =
      Math.sin(index * 0.33 + seed * 1.7) +
      Math.cos(index * 0.11 + seed * 2.6) * 0.55 +
      completion / 100;
    const level = Math.max(0, Math.min(4, Math.floor((wave + 0.75) * 1.45)));
    return level;
  });
}

function HabitListItem({ habit }: { habit: Habit }) {
  const activity = buildHeatmap(habit.seed, habit.completion);

  return (
    <li className="rounded-xl border border-card-border bg-background/65 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] leading-tight text-foreground">{habit.name}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
            {habit.cadence}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] ${
            habit.status === "on-track"
              ? "bg-accent-2/35 text-foreground"
              : "bg-accent-0 text-muted"
          }`}
        >
          {habit.status === "on-track" ? "On track" : "Needs attention"}
        </span>
      </div>
      <div
        className="mt-3 grid auto-cols-[10px] grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1 md:auto-cols-[12px]"
        role="img"
        aria-label={`${habit.name} activity intensity heatmap`}
      >
        {activity.map((level, index) => (
          <span
            key={`${habit.id}-${index}`}
            className={`h-[10px] w-[10px] rounded-[3px] border border-card-border/70 md:h-[12px] md:w-[12px] ${LEVEL_CLASSES[level]}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-sm text-muted">
        <p>{habit.streak}</p>
        <p className="font-mono text-xs uppercase tracking-[0.12em]">{habit.completion}% complete</p>
      </div>
    </li>
  );
}

export function HabitList() {
  return (
    <section className="rounded-2xl border border-card-border bg-card/85 p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl">Habits</h3>
        <span className="rounded-full bg-accent-1/50 px-3 py-1 font-mono text-xs uppercase tracking-[0.16em] text-foreground">
          Mock data
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        Planning view: this section is a placeholder for the upcoming dashboard redesign.
      </p>
      <ul className="mt-5 space-y-3">
        {mockHabits.map((habit) => (
          <HabitListItem key={habit.id} habit={habit} />
        ))}
      </ul>
    </section>
  );
}
