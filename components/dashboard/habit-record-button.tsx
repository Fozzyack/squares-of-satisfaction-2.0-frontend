"use client";

import { getBackendUrl } from "@/utils/env";
import { useRouter } from "next/navigation";
import { useState } from "react";

type HabitRecordButtonProps = {
  habitId: string;
  increment: number;
  unit: string | null;
  color: string | null;
};

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function HabitRecordButton({
  habitId,
  increment,
  unit,
  color,
}: HabitRecordButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const suffix = unit ? ` ${unit}` : "";
  const hasCustomColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color ?? "");

  const handleRecord = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${getBackendUrl()}/habits/${habitId}/record`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: increment,
          date: getTodayDateString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setErrorMsg(data?.error ?? "Could not record progress");
        return;
      }

      router.refresh();
    } catch {
      setErrorMsg("Could not reach server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleRecord}
        disabled={isSubmitting}
        className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 ${hasCustomColor ? "" : "bg-primary"}`}
        style={hasCustomColor ? { backgroundColor: color ?? undefined } : undefined}
      >
        {isSubmitting ? "Saving..." : `+${increment}${suffix}`}
      </button>
      {errorMsg ? (
        <p className="text-[11px] text-[#8d3212]" role="alert">
          {errorMsg}
        </p>
      ) : null}
    </div>
  );
}
