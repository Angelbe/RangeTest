"use client";

import type { RangeTrackProps } from "./types";

export default function RangeTrack({
  trackRef,
  trackLabel,
  minimumPosition,
  maximumPosition,
  minimumHandle,
  maximumHandle,
  onPointerDown,
}: RangeTrackProps) {
  return (
    <div
      ref={trackRef}
      aria-label={trackLabel}
      className="relative h-10 touch-none cursor-pointer"
      onPointerDown={onPointerDown}
    >
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-indigo-600"
        style={{
          left: minimumPosition,
          right: `${100 - Number.parseFloat(maximumPosition)}%`,
        }}
      />
      {minimumHandle}
      {maximumHandle}
    </div>
  );
}
