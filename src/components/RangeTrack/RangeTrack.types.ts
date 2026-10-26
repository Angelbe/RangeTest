import type { PointerEvent, ReactNode, RefObject } from "react";

export interface RangeTrackProps {
  trackRef: RefObject<HTMLDivElement | null>;
  trackLabel: string;
  minimumPosition: string;
  maximumPosition: string;
  minimumHandle: ReactNode;
  maximumHandle: ReactNode;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
}
