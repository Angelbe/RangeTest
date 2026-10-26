"use client";

import RangeHandle from "./RangeHandle";
import RangeLabel from "./RangeLabel";
import RangeTrack from "./RangeTrack";
import type { RangeProps, RangeSide } from "./types";
import { useRange } from "./useRange";
import { formatValue } from "./utils";

export type { RangeProps, RangeSide, RangeValues } from "./types";

export default function Range(props: RangeProps) {
  const range = useRange(props);
  const { label = "Price range" } = props;

  const renderHandle = (side: RangeSide) => {
    const index = side === "minimum" ? 0 : 1;
    return (
      <RangeHandle
        key={side}
        side={side}
        value={range.selected[index]}
        selected={range.selected}
        domainMin={range.domainMin}
        domainMax={range.domainMax}
        active={range.activeSide === side}
        onPointerDown={range.beginDrag}
        onKeyDown={range.handleKeyDown}
      />
    );
  };

  const renderLabel = (side: RangeSide) => {
    const index = side === "minimum" ? 0 : 1;
    return (
      <RangeLabel
        key={side}
        mode={range.mode}
        side={side}
        value={range.selected[index]}
        selected={range.selected}
        domainMin={range.domainMin}
        domainMax={range.domainMax}
        editing={range.editingSide === side}
        draft={range.draft}
        validationError={range.validationError}
        onStartEditing={range.startEditing}
        onDraftChange={range.setDraft}
        onCommitDraft={range.commitDraft}
        onCancelEditing={range.cancelEditing}
      />
    );
  };

  return (
    <section aria-label={label} className="w-full">
      <div className="mb-10 flex min-h-16 items-start justify-between gap-4">
        {renderLabel("minimum")}
        {renderLabel("maximum")}
      </div>

      <RangeTrack
        trackRef={range.trackRef}
        trackLabel={`${label} track`}
        minimumPosition={range.minimumPosition}
        maximumPosition={range.maximumPosition}
        minimumHandle={renderHandle("minimum")}
        maximumHandle={renderHandle("maximum")}
        onPointerDown={range.handleTrackPointerDown}
      />

      <div className="mt-2 flex justify-between text-xs font-medium tabular-nums text-slate-400">
        <span>{formatValue(range.domainMin)}</span>
        <span>{formatValue(range.domainMax)}</span>
      </div>
    </section>
  );
}
