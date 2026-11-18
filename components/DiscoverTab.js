"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFeed, getMatches, postSwipe, resetSwipes } from "@/lib/api";
import { CloseIcon, HeartIcon } from "./Icons";
import MatchModal from "./MatchModal";
import MatchesView from "./MatchesView";
import SwipeDeck from "./SwipeDeck";

export default function DiscoverTab() {
  const [view, setView] = useState("deck");
  const [profiles, setProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [latestMatch, setLatestMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const swipeLock = useRef(false);
  const deckRef = useRef(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [feed, matchData] = await Promise.all([getFeed(), getMatches()]);
      setProfiles(feed.profiles || []);
      setMatchCount(matchData.count || 0);
      setMatches(matchData.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMatches = useCallback(async () => {
    setMatchesLoading(true);
    try {
      const matchData = await getMatches();
      setMatches(matchData.matches || []);
      setMatchCount(matchData.count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handleSwipe = useCallback(async (profile, action) => {
    if (swipeLock.current) return;
    swipeLock.current = true;
    setBusy(true);
    setProfiles((current) => current.filter((item) => item.id !== profile.id));

    try {
      const result = await postSwipe(profile.id, action);
      if (result.matched && result.match) {
        setLatestMatch(result.match);
        setMatchCount((count) => count + 1);
      }
    } catch (err) {
      setProfiles((current) => [profile, ...current]);
      setError(err.message);
    } finally {
      setBusy(false);
      swipeLock.current = false;
    }
  }, []);

  const handleReset = async () => {
    setResetting(true);
    setError("");
    try {
      await resetSwipes();
      await loadFeed();
    } catch (err) {
      setError(err.message);
    } finally {
      setResetting(false);
    }
  };

  const openMatches = async () => {
    setLatestMatch(null);
    setView("matches");
    await loadMatches();
  };

  if (view === "matches") {
    return (
      <MatchesView
        matches={matches}
        loading={matchesLoading}
        error={error}
        onBack={() => {
          setView("deck");
          setError("");
        }}
      />
    );
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
            Coy
          </p>
          <h1
            className="text-[1.85rem] leading-none"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            Discover
          </h1>
        </div>
        <button
          type="button"
          onClick={openMatches}
          className="relative grid h-11 w-11 place-items-center rounded-full border border-[var(--line)] text-[var(--rose)]"
          aria-label="Open matches"
        >
          <HeartIcon filled />
          {matchCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-[var(--navy)] px-1 text-[10px] font-bold text-white">
              {matchCount}
            </span>
          ) : null}
        </button>
      </header>

      {error ? (
        <div className="mx-5 mb-2 rounded-2xl bg-[#fde8e8] px-4 py-3 text-sm text-[#9b2c2c]">
          <p>{error}</p>
          <button
            type="button"
            className="mt-1 font-semibold underline"
            onClick={loadFeed}
          >
            Try again
          </button>
        </div>
      ) : null}

      <div className="relative min-h-0 flex-1 px-4 pb-2">
        {loading ? (
          <div className="skeleton h-full rounded-[28px]" />
        ) : profiles.length === 0 ? (
          <EmptyFeed onReset={handleReset} resetting={resetting} />
        ) : (
          <SwipeDeck
            ref={deckRef}
            profiles={profiles}
            onSwipe={handleSwipe}
            disabled={busy}
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-8 px-6 py-4">
        <button
          type="button"
          disabled={busy || loading || profiles.length === 0}
          onClick={() => deckRef.current?.swipe("pass")}
          className="grid h-16 w-16 place-items-center rounded-full border border-[var(--line)] bg-white text-[var(--muted)] shadow-sm transition enabled:hover:scale-105 disabled:opacity-40"
          aria-label="Pass"
        >
          <CloseIcon />
        </button>
        <button
          type="button"
          disabled={busy || loading || profiles.length === 0}
          onClick={() => deckRef.current?.swipe("like")}
          className="grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full bg-[var(--rose)] text-white shadow-[0_10px_24px_rgba(226,75,106,0.35)] transition enabled:hover:scale-105 disabled:opacity-40"
          aria-label="Like"
        >
          <HeartIcon filled size={28} />
        </button>
      </div>

      <p className="hidden pb-3 text-center text-xs text-[var(--muted)] md:block">
        Drag the card, or use the buttons. Arrow keys work too.
      </p>

      <MatchModal
        match={latestMatch}
        onKeepSwiping={() => setLatestMatch(null)}
        onViewMatches={openMatches}
      />
    </section>
  );
}

function EmptyFeed({ onReset, resetting }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-[var(--line)] px-8 text-center">
      <p
        className="text-3xl"
        style={{ fontFamily: "var(--font-fraunces), serif" }}
      >
        You&apos;re all caught up
      </p>
      <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-[var(--muted)]">
        There are no more profiles to swipe. Matches stay saved across reloads.
      </p>
      <button
        type="button"
        onClick={onReset}
        disabled={resetting}
        className="mt-6 h-11 rounded-full bg-[var(--ink)] px-5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {resetting ? "Restoring…" : "Reset demo feed"}
      </button>
    </div>
  );
}
