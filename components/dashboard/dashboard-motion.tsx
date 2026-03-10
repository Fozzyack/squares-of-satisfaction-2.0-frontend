"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

type DashboardMotionProps = {
  children: ReactNode;
};

export function DashboardMotion({ children }: DashboardMotionProps) {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const main = scope.current;
      if (!main) {
        return;
      }

      const sections = gsap.utils.toArray<HTMLElement>("[data-dashboard-section]", main);
      const overviewCards = gsap.utils.toArray<HTMLElement>("[data-overview-card]", main);
      const habitItems = gsap.utils.toArray<HTMLElement>("[data-habit-item]", main);
      const habitGrids = gsap.utils.toArray<HTMLElement>("[data-habit-grid]", main);

      gsap.set(sections, { y: 18, autoAlpha: 0 });
      gsap.set(overviewCards, { y: 16, autoAlpha: 0, scale: 0.98 });
      gsap.set(habitItems, { y: 14, autoAlpha: 0 });
      gsap.set(habitGrids, { clipPath: "inset(0 100% 0 0)", autoAlpha: 0.6 });

      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline.to(sections, {
        y: 0,
        autoAlpha: 1,
        duration: 0.55,
        stagger: 0.12,
      });

      timeline.to(
        overviewCards,
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
        },
        "<0.1",
      );

      timeline.to(
        habitItems,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.04,
        },
        "<0.2",
      );

      timeline.to(
        habitGrids,
        {
          clipPath: "inset(0 0% 0 0)",
          autoAlpha: 1,
          duration: 0.5,
          stagger: 0.08,
        },
        "<0.05",
      );
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
