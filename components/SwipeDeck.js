"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ProfileCard from "./ProfileCard";

const THRESHOLD = 108;

const SwipeDeck = forwardRef(function SwipeDeck(
  { profiles, onSwipe, disabled },
  ref,
) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [exit, setExit] = useState(null);
  const pointerRef = useRef(null);
  const draggingRef = useRef(false);
  const busyRef = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });

  const current = profiles[0];
  const next = profiles[1];

  const resetDrag = () => {
    offsetRef.current = { x: 0, y: 0 };
    setOffset({ x: 0, y: 0 });
    pointerRef.current = null;
    draggingRef.current = false;
  };

  const finish = useCallback(
    async (action) => {
      if (!current || busyRef.current || disabled) return;
      busyRef.current = true;
      draggingRef.current = false;
      setExit(action === "like" ? "right" : "left");
      window.setTimeout(async () => {
        await onSwipe(current, action);
        setExit(null);
        resetDrag();
        busyRef.current = false;
      }, 280);
    },
    [current, disabled, onSwipe],
  );

  useImperativeHandle(ref, () => ({
    swipe: (action) => finish(action),
  }));

  useEffect(() => {
    const onKey = (event) => {
      if (disabled || busyRef.current || !current) return;
      if (event.key === "ArrowRight") finish("like");
      if (event.key === "ArrowLeft") finish("pass");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, disabled, finish]);

  const onPointerDown = (event) => {
    if (disabled || busyRef.current || !current) return;
    draggingRef.current = true;
    pointerRef.current = event.pointerId;
    startRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!draggingRef.current || event.pointerId !== pointerRef.current) return;
    const nextOffset = {
      x: event.clientX - startRef.current.x,
      y: event.clientY - startRef.current.y,
    };
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  };

  const onPointerUp = (event) => {
    if (event.pointerId !== pointerRef.current) return;
    draggingRef.current = false;
    const { x } = offsetRef.current;
    if (x > THRESHOLD) {
      finish("like");
      return;
    }
    if (x < -THRESHOLD) {
      finish("pass");
      return;
    }
    resetDrag();
  };

  if (!current) return null;

  const rotation = Math.max(-18, Math.min(18, offset.x / 14));
  const stamp =
    offset.x > 42 || exit === "right"
      ? "like"
      : offset.x < -42 || exit === "left"
        ? "pass"
        : null;

  return (
    <div className="relative h-full w-full">
      {next ? (
        <div className="absolute inset-0 origin-bottom scale-[0.96] opacity-70">
          <ProfileCard profile={next} />
        </div>
      ) : (
        <div className="absolute inset-3 rounded-[28px] border border-dashed border-[var(--line)]" />
      )}

      <div
        className={`absolute inset-0 touch-none select-none ${
          exit === "right"
            ? "card-fly-right"
            : exit === "left"
              ? "card-fly-left"
              : ""
        }`}
        style={
          exit
            ? undefined
            : {
                transform: `translate(${offset.x}px, ${offset.y * 0.35}px) rotate(${rotation}deg)`,
                transition: draggingRef.current
                  ? "none"
                  : "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
              }
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={resetDrag}
      >
        <ProfileCard profile={current} stamp={stamp} />
      </div>
    </div>
  );
});

export default SwipeDeck;
