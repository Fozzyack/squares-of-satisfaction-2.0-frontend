import { cn } from "@/utils/css";
import type { ReactNode } from "react";

type CardProps = {
    className?: string;
    children: ReactNode;
};

export function Card({ className, children }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-[20px] border border-card-border bg-card/90 shadow-[0_18px_40px_-34px_#7f3d1e] p-4",
                className,
            )}
        >
            {children}
        </div>
    );
}
