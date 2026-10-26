"use client";

import type { KeyboardEvent } from "react";
import type { RangeLabelProps } from "@/components/RangeLabel/RangeLabel.types";
import { formatValue } from "@/components/Range/utils";

export default function RangeLabel({
  mode,
  side,
  value,
  selected,
  domainMin,
  domainMax,
  editing,
  draft,
  validationError,
  onStartEditing,
  onDraftChange,
  onCommitDraft,
  onCancelEditing,
}: RangeLabelProps) {
  if (mode === "fixed") {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          {side}
        </span>
        <output
          aria-label={`${side === "minimum" ? "Minimum" : "Maximum"} value`}
          className="text-xl font-semibold tabular-nums text-slate-900"
        >
          {formatValue(value)}
        </output>
      </div>
    );
  }

  if (editing) {
    const errorId = `${side}-value-error`;
    return (
      <div className="flex min-w-32 flex-col gap-1">
        <label
          className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
          htmlFor={`${side}-value-input`}
        >
          {side}
        </label>
        <input
          autoFocus
          id={`${side}-value-input`}
          aria-label={`${side === "minimum" ? "Minimum" : "Maximum"} value`}
          aria-invalid={Boolean(validationError)}
          aria-describedby={validationError ? errorId : undefined}
          className="w-32 rounded-lg border border-indigo-300 bg-white px-3 py-2 text-lg font-semibold tabular-nums text-slate-900 outline-none ring-2 ring-indigo-100 focus:border-indigo-500"
          type="number"
          min={side === "minimum" ? domainMin : selected[0]}
          max={side === "minimum" ? selected[1] : domainMax}
          step="any"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onBlur={() => onCommitDraft(side)}
          onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onCommitDraft(side);
            } else if (event.key === "Escape") {
              onCancelEditing();
            }
          }}
        />
        {validationError && (
          <span
            className="max-w-48 text-xs text-rose-600"
            id={errorId}
            role="alert"
          >
            {validationError}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {side}
      </span>
      <button
        aria-label={`Edit ${side} value`}
        className="w-fit rounded-md text-left text-xl font-semibold tabular-nums text-slate-900 underline decoration-slate-300 decoration-dotted underline-offset-4 transition hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        type="button"
        onClick={() => onStartEditing(side)}
      >
        {formatValue(value)}
      </button>
    </div>
  );
}
