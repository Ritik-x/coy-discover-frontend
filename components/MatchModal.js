"use client";

export default function MatchModal({ match, onKeepSwiping, onViewMatches }) {
  if (!match) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-end bg-black/55 p-4 backdrop-blur-[2px] sm:items-center">
      <div className="match-pop w-full rounded-[28px] bg-[var(--paper)] p-6 text-center shadow-[var(--shadow)]">
        <div className="relative mx-auto mb-4 h-28 w-28">
          <span className="absolute inset-0 rounded-full bg-[var(--rose)]/30 [animation:pulse-ring_1.4s_ease-out_infinite]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={match.photo}
            alt={match.name}
            className="relative h-28 w-28 rounded-full object-cover ring-4 ring-white"
          />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--rose)]">
          It&apos;s a match
        </p>
        <h2
          className="mt-2 text-3xl text-[var(--ink)]"
          style={{ fontFamily: "var(--font-fraunces), serif" }}
        >
          You and {match.name} liked each other
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Incoming likes stay hidden until they are mutual. This one is yours.
        </p>
        <div className="mt-6 grid gap-2">
          <button
            type="button"
            onClick={onViewMatches}
            className="h-12 rounded-full bg-[var(--rose)] text-sm font-semibold text-white transition hover:bg-[var(--rose-deep)]"
          >
            View matches
          </button>
          <button
            type="button"
            onClick={onKeepSwiping}
            className="h-12 rounded-full border border-[var(--line)] text-sm font-semibold text-[var(--ink)]"
          >
            Keep swiping
          </button>
        </div>
      </div>
    </div>
  );
}
