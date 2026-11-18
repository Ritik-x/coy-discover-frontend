"use client";

import { useState } from "react";

export default function ProfileCard({ profile, stamp }) {
  const [broken, setBroken] = useState(false);
  const interests = Array.isArray(profile.interests) ? profile.interests : [];

  return (
    <article className="relative h-full w-full overflow-hidden rounded-[28px] bg-[#d8cfc4] shadow-[var(--shadow)]">
      {!broken ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.photo}
          alt={profile.name}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[#c9b8aa] text-5xl font-semibold text-white">
          {profile.name?.[0] || "?"}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {stamp ? (
        <div
          className={`pointer-events-none absolute top-7 left-6 rotate-[-18deg] rounded-md border-[3px] px-3 py-1 text-2xl font-black tracking-[0.18em] ${
            stamp === "like"
              ? "border-[#5ad6ae] text-[#5ad6ae]"
              : "border-[#ff7a90] text-[#ff7a90]"
          }`}
        >
          {stamp === "like" ? "LIKE" : "NOPE"}
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="flex items-end justify-between gap-3">
          <h2
            className="text-[1.85rem] leading-none"
            style={{ fontFamily: "var(--font-fraunces), serif" }}
          >
            {profile.name}
            <span className="ml-2 font-sans text-[1.35rem] font-medium opacity-90">
              {profile.age}
            </span>
          </h2>
        </div>
        <p className="mt-2 text-sm text-white/85">{profile.city}</p>
        <p className="mt-2 line-clamp-2 text-[15px] leading-snug text-white/95">
          {profile.bio}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-white/18 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
