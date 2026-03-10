"use client";

import { getBackendUrl } from "@/utils/env";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const COLOR_OPTIONS = [
  { label: "Tangerine", value: "#c84a1b", swatchClass: "bg-[#c84a1b]" },
  { label: "Clay", value: "#8b5a3c", swatchClass: "bg-[#8b5a3c]" },
  { label: "Honey", value: "#d4a017", swatchClass: "bg-[#d4a017]" },
  { label: "Moss", value: "#6f8d5f", swatchClass: "bg-[#6f8d5f]" },
  { label: "Ocean", value: "#3f7e9e", swatchClass: "bg-[#3f7e9e]" },
  { label: "Slate", value: "#5b6b7a", swatchClass: "bg-[#5b6b7a]" },
];

type FormFields = {
  name: string;
  unit: string;
  goal: number;
  increment: number;
  color: string;
};

const DEFAULT_FIELDS: FormFields = {
  name: "",
  unit: "",
  goal: 8,
  increment: 1,
  color: COLOR_OPTIONS[0].value,
};

function hexToRgba(hex: string, alpha: number) {
  const safeHex = hex.replace("#", "");
  const normalized =
    safeHex.length === 3
      ? safeHex
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : safeHex;
  const numeric = Number.parseInt(normalized, 16);
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function NewHabitForm() {
  const [form, setForm] = useState<FormFields>(DEFAULT_FIELDS);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const previewName = form.name.trim() || "Your new habit";
  const previewUnit = form.unit.trim();
  const previewProgress = Math.max(
    0,
    Math.min(100, Math.round((form.increment / Math.max(form.goal, 1)) * 100)),
  );
  const previewSquares = Array.from({ length: 114}, (_, index) => {
    const wave =
      Math.sin(index * 0.34 + form.goal * 0.09) +
      Math.cos(index * 0.15 + form.increment * 0.48) * 0.7;
    return Math.max(0, Math.min(4, Math.floor((wave + 1.55) * 1.35)));
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setErrorMsg("");
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleOpen = () => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsOpen(true);
  };

  const handleClose = () => {
    setErrorMsg("");
    setIsOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${getBackendUrl()}/habits`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          goal: Number(form.goal),
          increment: Number(form.increment),
          unit: form.unit.trim() === "" ? null : form.unit.trim(),
          color: form.color,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error ?? "Could not save your habit. Please try again.");
        return;
      }

      setSuccessMsg("Habit added. You can now start logging entries for it.");
      setForm(DEFAULT_FIELDS);
      setIsOpen(false);
    } catch {
      setErrorMsg("Unable to reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
      window.location.href = "/dashboard";
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;
    setErrorMsg("");
    setSuccessMsg("");

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  return (
    <>
      <section
        data-dashboard-section
        className="rounded-2xl border border-card-border bg-card/85 p-5 shadow-[0_10px_28px_-24px_rgba(43,22,13,0.9)] sm:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Add habit
            </p>
            <h3 className="mt-2 text-2xl">Start a new streak</h3>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Create a habit when you&apos;re ready. It will show up in your board.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpen}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-14px_#8f3616] transition hover:-translate-y-px"
          >
            + New habit
          </button>
        </div>
        {successMsg && (
          <p
            className="mt-4 rounded-xl border border-[#b7decb] bg-[#e9f8ef] px-3 py-2 text-sm text-[#1f6d46]"
            role="status"
          >
            {successMsg}
          </p>
        )}
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#2b160d]/40 p-4 pt-10 backdrop-blur-sm sm:items-center sm:pt-4"
          onClick={handleClose}
        >
          <section
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-card-border bg-card p-5 shadow-[0_28px_58px_-28px_rgba(43,22,13,0.88)] sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-label="Create new habit"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  New habit
                </p>
                <h4 className="mt-2 text-2xl">Create your habit</h4>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border border-card-border bg-background/70 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-muted transition hover:text-foreground"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">
                      Habit name
                    </span>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleOnChange}
                      placeholder="Drink water"
                      className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                      required
                      disabled={isSubmitting}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">
                      Daily goal
                    </span>
                    <input
                      name="goal"
                      type="number"
                      min={1}
                      max={9999}
                      value={form.goal}
                      onChange={handleOnChange}
                      className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                      required
                      disabled={isSubmitting}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">
                      Increment
                    </span>
                    <input
                      name="increment"
                      type="number"
                      min={1}
                      max={9999}
                      value={form.increment}
                      onChange={handleOnChange}
                      className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                      required
                      disabled={isSubmitting}
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-foreground">
                      Unit (optional)
                    </span>
                    <input
                      name="unit"
                      type="text"
                      value={form.unit}
                      onChange={handleOnChange}
                      placeholder="cups"
                      className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={isSubmitting}
                    />
                  </label>

                  <fieldset>
                    <legend className="mb-2 block text-sm font-medium text-foreground">
                      Board color
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((option) => {
                        const isSelected = form.color === option.value;

                        return (
                          <label
                            key={option.value}
                            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                              isSelected
                                ? "border-primary/70 bg-primary/10 text-foreground"
                                : "border-card-border bg-background/60 text-muted"
                            }`}
                          >
                            <input
                              className="sr-only"
                              type="radio"
                              name="color"
                              value={option.value}
                              checked={isSelected}
                              onChange={handleOnChange}
                              disabled={isSubmitting}
                            />
                            <span
                              className={`h-3 w-3 rounded-full border border-black/10 ${option.swatchClass}`}
                              aria-hidden="true"
                            />
                            <span className="font-mono uppercase tracking-[0.12em]">
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>

                {errorMsg && (
                  <p
                    className="rounded-xl border border-[#efc2a8] bg-[#ffe6d9] px-3 py-2 text-sm text-[#8d3212]"
                    role="alert"
                  >
                    {errorMsg}
                  </p>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full border border-card-border bg-background/70 px-4 py-2 text-sm text-foreground transition hover:bg-background"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-14px_#8f3616] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? "Adding habit..." : "Add habit"}
                  </button>
                </div>
              </form>

              <aside className="rounded-xl border border-card-border bg-background/55 p-4 lg:sticky lg:top-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  Live preview
                </p>
                <p className="mt-2 text-[15px] leading-tight text-foreground">
                  {previewName}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  Daily target
                </p>

                <div
                  className="mt-3 grid auto-cols-[11px] gap-1 grid-flow-col grid-rows-7"
                  role="img"
                  aria-label="Preview of new habit activity heatmap"
                >
                  {previewSquares.map((level, index) => (
                    <span
                      key={`preview-${index}`}
                      className="h-[11px] w-[11px] rounded-[3px] border border-card-border/70"
                      style={{
                        backgroundColor: hexToRgba(form.color, 0.18 + level * 0.19),
                      }}
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <p>
                      +{form.increment}
                      {previewUnit ? ` ${previewUnit}` : ""} logged
                    </p>
                    <p>{previewProgress}% of goal</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-accent-0">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${previewProgress}%`,
                        backgroundColor: form.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted">
                    Goal: {form.goal}
                    {previewUnit ? ` ${previewUnit}` : " entries"}
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
