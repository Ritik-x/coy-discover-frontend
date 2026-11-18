"use client";

import { BackIcon } from "./Icons";

export default function MatchesView({ matches, loading, error, onBack }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-2 px-3 pb-2 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full text-[var(--ink)]"
          aria-label="Back to Discover"
        >
          <BackIcon />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
            Mutual only
          </p>
          <h1
            className="text-2xl leading-tight"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Matches
          </h1>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
        {loading ? (
          <div className="grid gap-3 pt-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton h-24 rounded-2xl" />
            ))}
          </div>
        ) : null}

        {error ? (
          <p className="mt-6 rounded-2xl bg-[#fde8e8] px-4 py-3 text-sm text-[#9b2c2c]">
            {error}
          </p>
        ) : null}

        {!loading && !error && matches.length === 0 ? (
          <div className="mt-16 text-center">
            <p
              className="text-2xl"
              style={{ fontFamily: "var(--font-fraunces), serif" }}
            >
              No matches yet
            </p>
            <p className="mx-auto mt-2 max-w-[16rem] text-sm text-[var(--muted)]">
              Like someone who already liked you and they will appear here.
            </p>
          </div>
        ) : null}

        <ul className="grid gap-3 pt-2">
          {matches.map((match) => (
            <li
              key={match.id}
              className="flex gap-3 rounded-2xl border border-[var(--line)] bg-white p-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={match.photo}
                alt={match.name}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {match.name}, {match.age}
                </p>
                <p className="text-xs text-[var(--muted)]">{match.city}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--ink)]/80">
                  {match.bio}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
