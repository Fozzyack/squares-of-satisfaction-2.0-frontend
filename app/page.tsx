"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LEVEL_LABELS = ["None", "Low", "Steady", "Strong", "Peak"];
const LEVEL_CLASSES = [
  "bg-accent-0",
  "bg-accent-1",
  "bg-accent-2",
  "bg-accent-3",
  "bg-accent-4",
];

export default function Home() {
  const scope = useRef<HTMLDivElement>(null);

  const activity = useMemo(
    () =>
      Array.from({ length: 182 }, (_, index) => {
        const seed = Math.sin(index * 0.41) + Math.cos(index * 0.19) * 0.55;
        const level = Math.max(0, Math.min(4, Math.floor((seed + 1.6) * 1.5)));
        return {
          id: index,
          level,
          count: level === 0 ? 0 : level * 2 + (index % 3),
        };
      }),
    [],
  );

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .from("[data-animate='headline']", { y: 30, opacity: 0, duration: 0.7 })
        .from(
          "[data-animate='subtext']",
          { y: 24, opacity: 0, duration: 0.6 },
          "<0.1",
        )
        .from(
          "[data-animate='cta']",
          {
            y: 16,
            autoAlpha: 0,
            duration: 0.45,
            stagger: 0.08,
            clearProps: "transform,opacity,visibility",
          },
          "<0.05",
        )
        .from(
          "[data-square]",
          {
            scale: 0,
            transformOrigin: "center",
            duration: 0.35,
            stagger: { each: 0.004, from: "random" },
          },
          "<0.15",
        );

      gsap.to("[data-level='4']", {
        opacity: 0.5,
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: "sine.inOut",
        stagger: { each: 0.06, from: "edges" },
      });
    },
    { scope },
  );

  return (
    <div
      className="relative isolate min-h-screen bg-background p-4 md:p-8"
      ref={scope}
    >
      <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-[#fff0e1] via-[#fff8f2] to-[#ffeede]" />
      <main className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1140px] items-center gap-7 py-4 md:min-h-[calc(100vh-4rem)] md:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] md:gap-14 md:py-0">
        <section className="max-w-[560px]">
          <p
            className="m-0 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-muted"
            data-animate="headline"
          >
            TinyWins Habit Tracker
          </p>
          <h1
            className="mt-3 text-4xl leading-tight font-medium tracking-tight text-foreground md:text-6xl"
            data-animate="headline"
          >
            Build streaks you can see at a glance.
          </h1>
          <p
            className="mt-5 max-w-[54ch] text-base leading-relaxed text-muted md:text-lg"
            data-animate="subtext"
          >
            TinyWins turns your daily actions into a living contribution map.
            Stay consistent, spot patterns, and keep momentum with every square.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-14px_#8f3616] transition hover:-translate-y-px"
              data-animate="cta"
            >
              Start tracking
            </Link>
            <Link
              href="/demo"
              className="rounded-full bg-accent-0 px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-px"
              data-animate="cta"
            >
              View small demo
            </Link>
          </div>
          <div
            className="mt-5 flex flex-wrap gap-4 text-[0.94rem] text-muted"
            data-animate="subtext"
          >
            <p className="m-0">
              <span className="font-bold text-foreground">182</span> days
              tracked
            </p>
            <p className="m-0">
              <span className="font-bold text-foreground">86%</span> completion
              rate
            </p>
          </div>
        </section>

        <section
          className="rounded-[20px] border border-card-border bg-card/90 p-4 shadow-[0_18px_40px_-34px_#7f3d1e] md:p-6"
          aria-label="Habit heat map"
        >
          <header className="mb-4 flex items-baseline justify-between gap-3">
            <h4 className="m-0 text-[1.05rem] font-semibold">
              TinyWins Activity Board
            </h4>
            <p className="m-0 font-mono text-xs text-muted">Last 26 weeks</p>
          </header>

          <div
            className="mb-2 ml-1 grid grid-cols-6 font-mono text-[0.72rem] text-muted md:text-xs"
            aria-hidden="true"
          >
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
          </div>

          <div
            className="grid auto-cols-[10px] grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1 md:auto-cols-[12px]"
            role="img"
            aria-label="Daily habit intensity heatmap"
          >
            {activity.map(({ id, level, count }) => (
              <span
                key={id}
                data-square
                data-level={level}
                className={`h-[10px] w-[10px] rounded-[3px] border border-[#26110914] md:h-[12px] md:w-[12px] ${LEVEL_CLASSES[level]}`}
                title={`${count} completions - ${LEVEL_LABELS[level]}`}
                aria-hidden="true"
              />
            ))}
          </div>

          <div
            className="mt-4 flex items-center justify-end gap-1.5 font-mono text-[0.72rem] text-muted md:text-xs"
            aria-hidden="true"
          >
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className={`h-[11px] w-[11px] rounded-[3px] border border-[#26110914] ${LEVEL_CLASSES[level]}`}
                data-level={level}
              />
            ))}
            <span>More</span>
          </div>
        </section>
      </main>
    </div>
  );
}
