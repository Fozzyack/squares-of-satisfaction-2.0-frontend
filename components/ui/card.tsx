import type { ReactNode } from "react";

type CardProps = {
  className?: string;
  children: ReactNode;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={joinClasses(
        "rounded-[20px] border border-card-border bg-card/90 shadow-[0_18px_40px_-34px_#7f3d1e]",
        className,
      )}
    >
      {children}
    </div>
  );
}
