"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useMemo, useState } from "react";

const LEVEL_CLASSES = [
  "bg-blue-500/20",
  "bg-blue-500/40",
  "bg-blue-500/60",
  "bg-blue-500/80",
  "bg-blue-500/100",
];
export default function DemoPage() {
  const [userLevel, setUserLevel] = useState(0);
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

  const handleAddWater = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUserLevel((prev) => Math.min(prev + 5, 100));
  };
  console.log(userLevel);
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center p-4 md:p-8">
      <div className="w-full">
        <Link href="/">
          <p className="mb-4 text-sm">{"<"}- Back to Landing</p>
        </Link>
        <Card className="w-full">
          <div className="space-y-1.5 p-5">
            <h2 className="h2">Demo</h2>
          </div>
          <div className="flex items-center justify-between">
            <p> Cups of Water </p>
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
                  aria-hidden="true"
                />
              ))}
              <span
                data-square
                data-level={4}
                className={`h-[10px] w-[10px] rounded-[3px] border border-[#26110914] md:h-[12px] md:w-[12px] bg-blue-500/${userLevel}`}
                aria-hidden="true"
              />
            </div>
            <button
              type="button"
              onClick={handleAddWater}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              +1
            </button>
          </div>
        </Card>
      </div>
    </main>
  );
}
