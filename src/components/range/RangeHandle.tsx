"use client";

import type { RangeHandleProps } from "./types";
import { calculatePercentage, formatValue } from "./utils";

export default function RangeHandle({
  side,
  value,
  selected,
  domainMin,
  domainMax,
  active,
  onPointerDown,
  onKeyDown,
}: RangeHandleProps) {
  const title = side === "minimum" ? "Minimum value" : "Maximum value";

  return (
    <div
      role="slider"
      aria-label={title}
      aria-orientation="horizontal"
      aria-valuemin={side === "minimum" ? domainMin : selected[0]}
      aria-valuemax={side === "minimum" ? selected[1] : domainMax}
      aria-valuenow={value}
      aria-valuetext={formatValue(value)}
      tabIndex={0}
      className={`absolute top-1/2 z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none items-center justify-center rounded-full border-[5px] border-white bg-indigo-600 shadow-[0_2px_10px_rgba(30,41,59,0.22)] outline-none transition-[width,height,box-shadow,transform] duration-150 hover:size-9 hover:shadow-[0_4px_14px_rgba(79,70,229,0.35)] focus-visible:ring-4 focus-visible:ring-indigo-200 ${
        active ? "size-9 cursor-grabbing shadow-[0_4px_14px_rgba(79,70,229,0.4)]" : ""
      }`}
      style={{
        left: `${calculatePercentage(value, domainMin, domainMax)}%`,
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown(side, event);
      }}
      onKeyDown={(event) => onKeyDown(side, event)}
    />
  );
}
