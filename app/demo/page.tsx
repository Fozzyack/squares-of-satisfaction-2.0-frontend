"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const LEVEL_CLASSES = [
  "bg-blue-500/20",
  "bg-blue-500/40",
  "bg-blue-500/60",
  "bg-blue-500/80",
  "bg-blue-500/100",
];

const DAILY_GOAL = 8;

export default function DemoPage() {
  const scope = useRef<HTMLDivElement>(null);
  const [cupsLogged, setCupsLogged] = useState(0);
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

  const completionPercent = Math.round((cupsLogged / DAILY_GOAL) * 100);
  const progressPercent = Math.min(completionPercent, 100);

  const handleAddWater = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCupsLogged((prev) => prev + 1);
  };

  const handleResetWater = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCupsLogged(0);
  };

  useGSAP(
    () => {
      gsap.from("[data-square]", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
        duration: 0.32,
        ease: "power2.out",
        stagger: { each: 0.004, from: "random" },
      });
    },
    { scope },
  );

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-3xl items-center p-4 md:p-8"
      ref={scope}
    >
      <div className="w-full">
        <Link href="/">
          <p className="mb-4 text-sm">{"<"}- Back to Landing</p>
        </Link>
        <Card className="w-full">
          <div className="space-y-1.5 p-5">
            <h2 className="h2">Demo</h2>
            <p className="text-sm text-black/65">Track your daily hydration and keep your streak moving.</p>
          </div>
          <div className="space-y-4 px-5 pb-5">
            <div className="flex items-center justify-between">
              <p className="font-medium">Cups of Water</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetWater}
                  className="rounded-lg border border-black/10 px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleAddWater}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                >
                  +1
                </button>
              </div>
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
                  aria-label={`${count} cups logged`}
                />
              ))}
              <span
                data-square
                data-level={4}
                className="h-[10px] w-[10px] rounded-[3px] border border-[#26110914] bg-blue-500 md:h-[12px] md:w-[12px]"
                style={{ opacity: Math.max(0.2, Math.min(completionPercent / 100, 1)) }}
                aria-label={`Today: ${cupsLogged} cups`}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium">{cupsLogged} / {DAILY_GOAL} cups</p>
                <p className="text-black/65">{completionPercent}% complete</p>
              </div>
              <div className="h-2 w-full rounded-full bg-blue-100">
                <div
                  className="h-2 rounded-full bg-blue-500 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 text-xs text-black/60">
              <span>Less</span>
              {LEVEL_CLASSES.map((levelClass, index) => (
                <span
                  key={levelClass}
                  className={`h-3 w-3 rounded-[3px] border border-[#26110914] ${levelClass}`}
                  aria-hidden="true"
                  title={`Intensity ${index + 1}`}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
