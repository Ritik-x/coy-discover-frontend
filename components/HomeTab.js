export default function HomeTab() {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="px-6 pb-2 pt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          Coy
        </p>
        <h1
          className="mt-1 text-3xl text-[var(--ink)]"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          Home
        </h1>
      </header>
      <div className="flex flex-1 items-center justify-center px-8" />
    </section>
  );
}
