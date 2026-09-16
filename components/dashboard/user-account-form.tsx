"use client";

import { getBackendUrl } from "@/utils/env";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Settings } from "lucide-react";

type UserAccountDialogProps = {
    userData: {
        name?: string;
        email?: string;
    };
};

type UpdateUserFormFields = {
    name?: string;
    newPassword?: string;
    currentPassword: string;
};

const DEFAULT_FIELDS: UpdateUserFormFields = {
    name: "",
    newPassword: "",
    currentPassword: "",
};

const DELETE_REDIRECT_DELAY_MS = 2000;

export function UserAccountDialog({ userData }: UserAccountDialogProps) {
    const router = useRouter();
    const [form, setForm] = useState<UpdateUserFormFields>(DEFAULT_FIELDS);
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [isDeleteRedirecting, setIsDeleteRedirecting] = useState(false);
    const [deleteErrorMsg, setDeleteErrorMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const deleteRedirectTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                if (isDeleteModalOpen) {
                    if (!isDeletingAccount && !isDeleteRedirecting) {
                        setIsDeleteModalOpen(false);
                        setDeleteErrorMsg("");
                    }
                    return;
                }

                setIsOpen(false);
                setIsDeleteModalOpen(false);
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
    }, [isOpen, isDeleteModalOpen, isDeleteRedirecting, isDeletingAccount]);

    useEffect(() => {
        return () => {
            if (deleteRedirectTimeoutRef.current !== null) {
                window.clearTimeout(deleteRedirectTimeoutRef.current);
            }
        };
    }, []);

    const handleOpen = () => {
        setForm({
            name: userData.name ?? "",
            newPassword: "",
            currentPassword: "",
        });
        setIsDeleteModalOpen(false);
        setIsDeleteRedirecting(false);
        setDeleteErrorMsg("");
        setErrorMsg("");
        setSuccessMsg("");
        setIsOpen(true);
    };

    const handleClose = () => {
        if (isDeletingAccount || isDeleteRedirecting) {
            return;
        }

        setIsDeleteModalOpen(false);
        setDeleteErrorMsg("");
        setErrorMsg("");
        setIsOpen(false);
    };

    const openDeleteModal = () => {
        if (isDeletingAccount || isDeleteRedirecting) {
            return;
        }

        setDeleteErrorMsg("");
        setSuccessMsg("");
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (isDeletingAccount || isDeleteRedirecting) {
            return;
        }

        setDeleteErrorMsg("");
        setIsDeleteModalOpen(false);
    };

    const handleDeleteAccount = async () => {
        if (isDeletingAccount || isDeleteRedirecting) {
            return;
        }

        setIsDeletingAccount(true);
        setDeleteErrorMsg("");
        setSuccessMsg("");

        try {
            const response = await fetch(`${getBackendUrl()}/users`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setDeleteErrorMsg(
                    data?.error ??
                        "Could not delete account. Please try again.",
                );
                return;
            }

            setSuccessMsg(
                "Account deleted successfully. Redirecting to homepage...",
            );
            setIsDeleteRedirecting(true);
            deleteRedirectTimeoutRef.current = window.setTimeout(() => {
                deleteRedirectTimeoutRef.current = null;
                router.replace("/");
            }, DELETE_REDIRECT_DELAY_MS);
        } catch {
            setDeleteErrorMsg("Unable to reach the server. Please try again.");
        } finally {
            setIsDeletingAccount(false);
        }
    };

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const response = await fetch(`${getBackendUrl()}/users`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                // conditionally add fields to the request body if they are not empty
                body: JSON.stringify({
                    name: form.name || undefined,
                    newPassword: form.newPassword || undefined,
                    currentPassword: form.currentPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(
                    data.error ??
                        "Could not update account settings. Please try again.",
                );
                return;
            }

            setSuccessMsg("Account settings updated successfully.");
            setForm((previous) => ({
                ...previous,
                newPassword: "",
                currentPassword: "",
            }));
            router.refresh();
        } catch {
            setErrorMsg("Unable to reach the server. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setErrorMsg("");
        setSuccessMsg("");

        setForm((previous) => ({
            ...previous,
            [name as keyof UpdateUserFormFields]: value,
        }));
    };

    return (
        <>
            <button
                onClick={handleOpen}
                aria-label="Open account settings"
                title="Settings"
                className="group inline-flex h-7 w-7 items-center justify-center rounded-full border border-card-border bg-background/70 text-muted transition hover:text-foreground"
            >
                <Settings
                    className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:animate-spin"
                    aria-hidden="true"
                />
                <span className="sr-only">Settings</span>
            </button>
            {isOpen &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
                        <section
                            className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl border border-card-border bg-card p-5 shadow-modal sm:p-7"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Update account settings"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h4 className="mt-2 text-2xl">
                                        Account Settings
                                    </h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="rounded-full border border-card-border bg-background/70 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-muted transition hover:text-foreground"
                                >
                                    Close
                                </button>
                            </div>
                            <div className="mt-6">
                                <div className="flex flex-col items-start gap-4">
                                    <form
                                        className="mt-4 flex max-w-md flex-col gap-4"
                                        onSubmit={handleSubmit}
                                    >
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-muted"
                                            >
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={form.name ?? ""}
                                                onChange={handleOnChange}
                                                className="mt-1 block w-full rounded-md border border-card-border bg-background/70 px-3 py-2 text-sm text-foreground shadow-sm focus:border-foreground focus:ring-1 focus:ring-foreground"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted">
                                                Email
                                            </label>
                                            <input
                                                type="text"
                                                id="email"
                                                value={userData.email ?? ""}
                                                disabled
                                                readOnly
                                                className="mt-1 block w-full rounded-md border border-card-border bg-background/70 px-3 py-2 text-sm text-foreground/70 shadow-sm focus:border-foreground focus:ring-1 focus:ring-foreground hover:cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="password"
                                                className="block text-sm font-medium text-muted"
                                            >
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="newPassword"
                                                value={form.newPassword ?? ""}
                                                onChange={handleOnChange}
                                                className="mt-1 block w-full rounded-md border border-card-border bg-background/70 px-3 py-2 text-sm text-foreground shadow-sm focus:border-foreground focus:ring-1 focus:ring-foreground"
                                            />
                                        </div>
                                        <div className="pt-4">
                                            <label
                                                htmlFor="current-password"
                                                className="block text-sm font-medium text-muted"
                                            >
                                                Current Password (required to
                                                save changes)
                                            </label>
                                            <input
                                                type="password"
                                                id="current-password"
                                                name="currentPassword"
                                                value={form.currentPassword}
                                                onChange={handleOnChange}
                                                required
                                                className="mt-1 block w-full rounded-md border border-card-border bg-background/70 px-3 py-2 text-sm text-foreground shadow-sm focus:border-foreground focus:ring-1 focus:ring-foreground"
                                            />
                                        </div>
                                        <div className="flex items-center gap-7">
                                            <button
                                                type="submit"
                                                disabled={
                                                    isSubmitting ||
                                                    isDeletingAccount ||
                                                    isDeleteRedirecting
                                                }
                                                className="self-start rounded-full border border-card-border bg-background/70 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-muted transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {isSubmitting
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={
                                                    isSubmitting ||
                                                    isDeletingAccount ||
                                                    isDeleteRedirecting
                                                }
                                                className="self-end rounded-full border border-red-500 bg-red-500/10 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-red-500 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                                onClick={openDeleteModal}
                                            >
                                                Delete Account
                                            </button>
                                        </div>
                                    </form>
                                    {errorMsg && (
                                        <p className="mt-4 text-sm text-red-500">
                                            {errorMsg}
                                        </p>
                                    )}
                                    {successMsg && !isDeleteModalOpen && (
                                        <p
                                            className="mt-4 text-sm text-green-500"
                                            role="status"
                                        >
                                            {successMsg}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>,
                    document.body,
                )}
            {isOpen &&
                isDeleteModalOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[120] flex items-start justify-center bg-overlay p-4 pt-10 backdrop-blur-sm sm:items-center sm:pt-4"
                        onClick={closeDeleteModal}
                    >
                        <section
                            className="w-full max-w-md rounded-2xl border border-card-border bg-card p-5 shadow-modal sm:p-6"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Delete account confirmation"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                                        Account settings
                                    </p>
                                    <h4 className="mt-2 text-xl text-foreground">
                                        Delete account?
                                    </h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    disabled={
                                        isDeletingAccount || isDeleteRedirecting
                                    }
                                    className="rounded-full border border-card-border bg-background/70 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-muted transition hover:text-foreground"
                                >
                                    Close
                                </button>
                            </div>

                            <p className="mt-4 text-sm text-muted">
                                Delete permanently removes your account and all
                                of its history.
                            </p>

                            <div className="mt-5 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeDeleteModal}
                                    disabled={
                                        isDeletingAccount || isDeleteRedirecting
                                    }
                                    className="rounded-full border border-card-border bg-background/70 px-4 py-2 text-sm text-foreground transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    disabled={
                                        isDeletingAccount || isDeleteRedirecting
                                    }
                                    className="rounded-full bg-danger px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:-translate-y-px hover:bg-danger-hover disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
                                >
                                    {isDeletingAccount
                                        ? "Deleting..."
                                        : isDeleteRedirecting
                                          ? "Redirecting..."
                                          : "Delete account"}
                                </button>
                            </div>
                            {deleteErrorMsg ? (
                                <p
                                    className="mt-3 rounded-xl border border-danger-border bg-danger-background px-3 py-2 text-sm text-danger-foreground"
                                    role="alert"
                                >
                                    {deleteErrorMsg}
                                </p>
                            ) : null}
                            {successMsg ? (
                                <p
                                    className="mt-3 rounded-xl border border-success-border bg-success-background px-3 py-2 text-sm text-success-foreground"
                                    role="status"
                                >
                                    {successMsg}
                                </p>
                            ) : null}
                        </section>
                    </div>,
                    document.body,
                )}
        </>
    );
}
