import type { KeyboardEvent, PointerEvent } from "react";
import type { RangeSide, RangeValues } from "@/components/Range/Range.types";

export interface RangeHandleProps {
  side: RangeSide;
  value: number;
  selected: RangeValues;
  domainMin: number;
  domainMax: number;
  active: boolean;
  onPointerDown: (side: RangeSide, event: PointerEvent<HTMLElement>) => void;
  onKeyDown: (side: RangeSide, event: KeyboardEvent<HTMLDivElement>) => void;
}
