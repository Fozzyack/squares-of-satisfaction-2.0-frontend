"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const THEME_KEY = "tiny-wins-theme";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.dataset.theme === "dark");
    }, []);

    const toggleTheme = () => {
        const nextIsDark = !isDark;
        document.documentElement.dataset.theme = nextIsDark ? "dark" : "light";
        localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");
        setIsDark(nextIsDark);
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
            className="fixed right-4 bottom-4 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-card-border bg-card/90 text-muted shadow-card transition hover:-translate-y-px hover:text-foreground"
        >
            {isDark ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
            )}
        </button>
    );
}
