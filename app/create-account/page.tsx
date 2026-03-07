import Link from "next/link";

export default function CreateAccountPage() {
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
            Start tracking tiny daily wins and build streaks you can actually see.
          </p>

          <form className="mt-6 space-y-4" action="#" method="post">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">Password</span>
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="Create a password"
                className="w-full rounded-xl border border-card-border bg-white/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-primary/20"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_10px_24px_-14px_#8f3616] transition hover:-translate-y-px"
            >
              Create account
            </button>
          </form>

          <div className="mt-5 text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground transition hover:text-primary">
              Sign in
            </Link>
          </div>
          </section>
        </div>
      </main>
    </div>
  );
}
