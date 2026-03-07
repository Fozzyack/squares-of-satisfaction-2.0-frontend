"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LEVEL_LABELS = ["None", "Low", "Steady", "Strong", "Peak"];

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
          { y: 16, opacity: 0, duration: 0.45, stagger: 0.08 },
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
    <div className="landing" ref={scope}>
      <div className="ambient" />
      <main className="hero-shell">
        <section className="hero-copy">
          <p className="eyebrow" data-animate="headline">
            TinyWins Habit Tracker
          </p>
          <h1 className="hero-title" data-animate="headline">
            Build streaks you can see at a glance.
          </h1>
          <p className="hero-subtext" data-animate="subtext">
            TinyWins turns your daily actions into a living contribution map.
            Stay consistent, spot patterns, and keep momentum with every square.
          </p>
          <div className="hero-actions">
            <a href="#" className="btn-primary" data-animate="cta">
              Start tracking
            </a>
            <a href="#" className="btn-secondary" data-animate="cta">
              View weekly demo
            </a>
          </div>
          <div className="hero-stats" data-animate="subtext">
            <p>
              <span>182</span> days tracked
            </p>
            <p>
              <span>86%</span> completion rate
            </p>
          </div>
        </section>

        <section className="board-card" aria-label="Habit heat map">
          <header className="board-head">
            <h2>Contribution-style Habit Board</h2>
            <p>Last 26 weeks</p>
          </header>

          <div className="month-row" aria-hidden="true">
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
          </div>

          <div className="heatmap" role="img" aria-label="Daily habit intensity heatmap">
            {activity.map(({ id, level, count }) => (
              <span
                key={id}
                data-square
                data-level={level}
                className="cell"
                title={`${count} completions - ${LEVEL_LABELS[level]}`}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="legend" aria-hidden="true">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <span key={level} className="cell" data-level={level} />
            ))}
            <span>More</span>
          </div>
        </section>
      </main>
    </div>
  );
}
