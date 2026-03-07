"use client";

import { getBackendUrl } from "@/utils/env";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState, type ChangeEvent } from "react";

export default function CreateAccountPage() {
    const [formField, setFormField] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
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
            const res = await fetch(`${getBackendUrl()}/users`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formField),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrorMsg(data.error ?? "Could not create your account.");
                return;
            }

            setSuccessMsg(
                "Account created successfully. Redirecting to your dashboard...",
            );
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
        <div className="relative isolate min-h-screen bg-background p-4 md:p-8">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-linear-to-br from-[#fff0e1] via-[#fff8f2] to-[#ffeede]" />

            <main className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1140px] items-center py-4 md:min-h-[calc(100vh-4rem)] md:py-0">
                <div className="mx-auto w-full max-w-[430px]">
                    <Link href="/">
                        <p className="mb-4 text-sm">{"<"}- Back to Landing</p>
                    </Link>

                    <section className="w-full rounded-[20px] border border-card-border bg-card/90 p-6 shadow-[0_18px_40px_-34px_#7f3d1e] md:p-7">
                        <p className="m-0 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-muted">
                            New to TinyWins
                        </p>
                        <h1 className="mt-3 text-3xl leading-tight font-medium tracking-tight text-foreground md:text-4xl">
                            Create your account
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                            Start tracking tiny daily wins and build streaks you
                            can actually see.
                        </p>

                        <form
                            className="mt-6 space-y-4"
                            onSubmit={handleSubmit}
                        >
                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    Name
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formField.name}
                                    onChange={handleInputChange}
                                    autoComplete="name"
                                    placeholder="Your name"
                                    className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    Email
                                </span>
                                <input
                                    type="email"
                                    name="email"
                                    value={formField.email}
                                    onChange={handleInputChange}
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1.5 block text-sm font-medium text-foreground">
                                    Password
                                </span>
                                <input
                                    type="password"
                                    name="password"
                                    value={formField.password}
                                    onChange={handleInputChange}
                                    autoComplete="new-password"
                                    placeholder="Create a password"
                                    className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-70"
                                    required
                                    disabled={loading}
                                />
                            </label>

                            {errorMsg && (
                                <p
                                    className="rounded-xl border border-[#efc2a8] bg-[#ffe6d9] px-3 py-2 text-sm text-[#8d3212]"
                                    role="alert"
                                >
                                    {errorMsg}
                                </p>
                            )}

                            {successMsg && (
                                <p
                                    className="rounded-xl border border-[#b7decb] bg-[#e9f8ef] px-3 py-2 text-sm text-[#1f6d46]"
                                    role="status"
                                >
                                    {successMsg}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-14px_#8f3616] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Create account"}
                            </button>
                        </form>

                        <div className="mt-5 text-sm text-muted">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-foreground transition hover:text-primary"
                            >
                                Sign in
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
