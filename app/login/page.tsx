"use client";

import { getBackendUrl } from "@/utils/env";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, SubmitEvent, useState } from "react";

export default function LoginPage() {
    const [formField, setFormField] = useState({
        email: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorMsg("");
        setSuccessMsg("");
        setFormField((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch(`${getBackendUrl()}/users/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formField.email,
                    password: formField.password,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(
                    data.error ?? "Could not sign in. Please try again.",
                );
                return;
            }

            setSuccessMsg(
                "Signed in successfully. Redirecting to your dashboard...",
            );
            await new Promise((resolve) => setTimeout(resolve, 700));
            setTimeout(() => {
                router.replace("/dashboard");
            }, 2000);
        } catch {
            setErrorMsg("Unable to reach the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <main className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1140px] items-center py-4 md:min-h-[calc(100vh-4rem)] md:py-0">
                <div className="auth-anim-shell mx-auto w-full max-w-[440px]">
                    <Link
                        href="/"
                        className="mb-5 inline-flex text-sm font-medium text-muted transition hover:text-foreground"
                    >
                        {"<- Back to home"}
                    </Link>

                    <section className="w-full rounded-[20px] border border-card-border bg-card p-6 shadow-card md:p-8">
                        <h1 className="auth-anim-item auth-anim-item-1 text-3xl leading-tight font-medium tracking-tight text-foreground md:text-[2rem]">
                            Sign in to TinyWins
                        </h1>
                        <p className="auth-anim-item auth-anim-item-2 mt-2 text-sm leading-relaxed text-muted">
                            Keep your streak going. Log in to view your activity
                            board and daily progress.
                        </p>

                        <form
                            className="auth-anim-item auth-anim-item-3 mt-7 space-y-5"
                            onSubmit={handleSubmit}
                        >
                            <label className="block" htmlFor="email">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    Email
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formField.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-card-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <div className="block">
                                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                                    <label
                                        className="block text-sm font-medium text-foreground"
                                        htmlFor="password"
                                    >
                                        Password
                                    </label>
                                    <Link
                                        href="#"
                                        className="text-xs font-medium text-muted transition hover:text-primary"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        value={formField.password}
                                        onChange={handleInputChange}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-card-border bg-input px-4 py-3 pr-11 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        disabled={loading}
                                        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        {showPassword ? (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            >
                                                <path d="M3 3l18 18" />
                                                <path d="M10.6 5.7A9.8 9.8 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.4 4.2" />
                                                <path d="M6.7 6.7A16.6 16.6 0 0 0 2.5 12S6 18.5 12 18.5a9.7 9.7 0 0 0 3.9-.8" />
                                                <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                                            </svg>
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-4 w-4"
                                                aria-hidden="true"
                                            >
                                                <path d="M2.5 12S6 5.5 12 5.5S21.5 12 21.5 12S18 18.5 12 18.5S2.5 12 2.5 12Z" />
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="2.5"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {errorMsg && (
                                <p
                                    className="rounded-xl border border-danger-border bg-danger-background px-3 py-2 text-sm text-danger-foreground"
                                    role="alert"
                                >
                                    {errorMsg}
                                </p>
                            )}

                            {successMsg && (
                                <p
                                    className="rounded-xl border border-success-border bg-success-background px-3 py-2 text-sm text-success-foreground"
                                    role="status"
                                >
                                    {successMsg}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-button transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <div className="auth-anim-item auth-anim-item-4 mt-6 border-t border-card-border pt-5 text-center text-sm text-muted">
                            <span>New to TinyWins? </span>
                            <Link
                                href="/create-account"
                                className="font-semibold text-foreground underline decoration-card-border underline-offset-4 transition hover:text-primary hover:decoration-primary"
                            >
                                Create an account
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
