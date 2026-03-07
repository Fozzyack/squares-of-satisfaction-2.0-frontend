import { getBackendUrl } from "@/utils/env";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(
    process.env.NEXT_PUBLIC_COOKIE_NAME ?? "tiny-wins",
  );
  let data;
  if (!cookie) {
    redirect("/login");
  }
  try {
    const res = await fetch(`${getBackendUrl()}/users`, {
      credentials: "include",
      headers: {
        Cookie: `${cookie.name}=${cookie.value}`,
      },
    });
    data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
  } catch (error) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen pb-10">
      <header className="border-b border-[var(--color-card-border)] bg-[var(--color-card)]/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-end justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Dashboard
            </p>
            <h2 className="mt-1 text-3xl sm:text-4xl">Welcome back, {data.name}</h2>
          </div>
          <p className="mb-1 hidden font-mono text-xs uppercase tracking-[0.16em] text-[var(--color-muted)] sm:block">
            TinyWins
          </p>
        </div>
      </header>
      {children}
    </div>
  );
};

export default DashboardLayout;
