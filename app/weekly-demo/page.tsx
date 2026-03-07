"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HABITS = [
  "Morning stretch",
  "Hydrate 2L",
  "No doomscrolling",
  "Read 20 mins",
  "Walk 8k steps",
  "Journal",
];

const INITIAL: boolean[][] = [
  [true, true, false, true, true, true, false],
  [true, false, true, true, false, true, true],
  [false, true, true, false, true, true, false],
  [true, true, true, false, false, true, true],
  [false, true, true, true, false, true, true],
  [true, false, false, true, true, false, true],
];

const LEVEL_CLASSES = [
  "bg-accent-0",
  "bg-accent-1",
  "bg-accent-2",
  "bg-accent-3",
  "bg-accent-4",
];

function levelForCount(count: number) {
  if (count <= 0) return 0;
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 4) return 3;
  return 4;
}

export default function WeeklyDemoPage() {
  const scope = useRef<HTMLDivElement>(null);
  const [checks, setChecks] = useState(INITIAL);

  const { totalDone, totalPossible, rate, dayCounts, bestDay, currentStreak } = useMemo(() => {
    const totalPossibleLocal = HABITS.length * DAYS.length;
    const dayCountsLocal = DAYS.map((_, dayIndex) =>
      checks.reduce((sum, row) => sum + (row[dayIndex] ? 1 : 0), 0),
    );
    const totalDoneLocal = dayCountsLocal.reduce((sum, value) => sum + value, 0);
    const rateLocal = Math.round((totalDoneLocal / totalPossibleLocal) * 100);
    const bestDayIndex = dayCountsLocal.indexOf(Math.max(...dayCountsLocal));

    let streak = 0;
    for (let index = dayCountsLocal.length - 1; index >= 0; index -= 1) {
      if (dayCountsLocal[index] === 0) break;
      streak += 1;
    }

    return {
      totalDone: totalDoneLocal,
      totalPossible: totalPossibleLocal,
      rate: Number.isFinite(rateLocal) ? rateLocal : 0,
      dayCounts: dayCountsLocal,
      bestDay: DAYS[bestDayIndex],
      currentStreak: streak,
    };
  }, [checks]);

  useGSAP(
    () => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-fade='top']", { y: 22, opacity: 0, duration: 0.5, stagger: 0.08 })
        .from("[data-fade='panel']", { y: 26, opacity: 0, duration: 0.6 }, "<0.05")
        .from(
          "[data-check='cell']",
          { scale: 0, opacity: 0, transformOrigin: "center", duration: 0.2, stagger: 0.003 },
          "<0.05",
        );
    },
    { scope },
  );

  function toggle(habitIndex: number, dayIndex: number) {
    setChecks((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === habitIndex
          ? row.map((value, valueIndex) => (valueIndex === dayIndex ? !value : value))
          : row,
      ),
    );
  }

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,#ffe4cf_0,transparent_38%),radial-gradient(circle_at_100%_100%,#ffd2b7_0,transparent_34%),#fff4ea] p-4 text-foreground md:p-8"
      ref={scope}
    >
      <div className="mx-auto grid max-w-[1080px] gap-4">
        <div className="flex items-center justify-between" data-fade="top">
          <Link href="/" className="font-mono text-sm text-muted no-underline">
            {"<- Back to landing"}
          </Link>
          <span className="rounded-full border border-card-border bg-card px-3 py-1.5 text-xs text-muted">
            Weekly demo
          </span>
        </div>

        <section
          className="rounded-[20px] border border-card-border bg-card/90 p-4 shadow-[0_18px_40px_-34px_#7f3d1e] md:p-6"
          data-fade="top"
        >
          <h1 className="m-0 text-[clamp(1.4rem,2.8vw,2rem)] font-semibold tracking-[-0.02em]">
            TinyWins Weekly Playground
          </h1>
          <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">
            Toggle any square to simulate a real week. This gives a quick feel for how your
            habit board and momentum metrics react in the app.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <article className="rounded-xl border border-[#f0d9c7] bg-[#fff6ef] p-3">
              <p className="m-0 text-[0.72rem] tracking-[0.08em] text-[#966246] uppercase">
                Completion Rate
              </p>
              <p className="mt-1.5 text-2xl font-bold">{rate}%</p>
            </article>
            <article className="rounded-xl border border-[#f0d9c7] bg-[#fff6ef] p-3">
              <p className="m-0 text-[0.72rem] tracking-[0.08em] text-[#966246] uppercase">
                Current Streak
              </p>
              <p className="mt-1.5 text-2xl font-bold">{currentStreak} days</p>
            </article>
            <article className="rounded-xl border border-[#f0d9c7] bg-[#fff6ef] p-3">
              <p className="m-0 text-[0.72rem] tracking-[0.08em] text-[#966246] uppercase">
                Completed
              </p>
              <p className="mt-1.5 text-2xl font-bold">
                {totalDone}/{totalPossible}
              </p>
            </article>
          </div>
        </section>

        <section
          className="rounded-[20px] border border-card-border bg-card p-4 md:p-5"
          data-fade="panel"
        >
          <div className="grid grid-cols-[120px_repeat(7,minmax(26px,1fr))] items-center gap-1.5 md:grid-cols-[170px_repeat(7,minmax(30px,1fr))] md:gap-2">
            <span className="font-mono text-center text-[0.78rem] text-muted" />
            {DAYS.map((day) => (
              <span className="font-mono text-center text-[0.78rem] text-muted" key={day}>
                {day}
              </span>
            ))}
          </div>

          {HABITS.map((habit, habitIndex) => (
            <div
              className="mt-1.5 grid grid-cols-[120px_repeat(7,minmax(26px,1fr))] items-center gap-1.5 md:grid-cols-[170px_repeat(7,minmax(30px,1fr))] md:gap-2"
              key={habit}
            >
              <span className="text-[0.82rem] text-[#4a2718] md:text-[0.92rem]">{habit}</span>
              {DAYS.map((day, dayIndex) => {
                const active = checks[habitIndex][dayIndex];
                const level = levelForCount(dayCounts[dayIndex]);
                const levelClass = LEVEL_CLASSES[active ? level : 0];

                return (
                  <button
                    key={`${habit}-${day}`}
                    className={`aspect-square w-full cursor-pointer appearance-none rounded-lg border border-[#f0d9c7] transition hover:-translate-y-px hover:border-[#e7b796] ${levelClass}`}
                    onClick={() => toggle(habitIndex, dayIndex)}
                    aria-pressed={active}
                    aria-label={`${habit} on ${day}: ${active ? "done" : "not done"}`}
                    data-check="cell"
                  />
                );
              })}
            </div>
          ))}

          <div className="mt-4">
            <p className="mb-2 text-[0.8rem] tracking-[0.08em] text-muted uppercase">
              Daily Intensity Strip
            </p>
            <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
              {DAYS.map((day, dayIndex) => {
                const level = levelForCount(dayCounts[dayIndex]);
                return (
                  <div
                    key={day}
                    className={`flex min-h-[60px] flex-col justify-between rounded-[10px] border border-card-border p-2 ${LEVEL_CLASSES[level]}`}
                  >
                    <strong className="text-[0.82rem] text-[#5d3322]">{day}</strong>
                    <span className="text-[0.74rem] text-muted">{dayCounts[dayIndex]} habits done</span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-2 text-xs text-[#8d5a3f]">Best day this week: {bestDay}</p>
        </section>
      </div>
    </div>
  );
}
