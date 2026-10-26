import type {
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  RefObject,
} from "react";

export type RangeSide = "minimum" | "maximum";
export type RangeValues = [number, number];

export interface RangeCommonProps {
  initialValues?: RangeValues;
  label?: string;
}

export interface NormalRangeProps extends RangeCommonProps {
  mode: "normal";
  min: number;
  max: number;
}

export interface FixedRangeProps extends RangeCommonProps {
  mode: "fixed";
  values: number[];
}

export type RangeProps = NormalRangeProps | FixedRangeProps;

export interface RangeLabelProps {
  mode: RangeProps["mode"];
  side: RangeSide;
  value: number;
  selected: RangeValues;
  domainMin: number;
  domainMax: number;
  editing: boolean;
  draft: string;
  validationError: string;
  onStartEditing: (side: RangeSide) => void;
  onDraftChange: (draft: string) => void;
  onCommitDraft: (side: RangeSide) => void;
  onCancelEditing: () => void;
}

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

export interface RangeTrackProps {
  trackRef: RefObject<HTMLDivElement | null>;
  trackLabel: string;
  minimumPosition: string;
  maximumPosition: string;
  minimumHandle: ReactNode;
  maximumHandle: ReactNode;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
}

export interface UseRangeResult {
  mode: RangeProps["mode"];
  selected: RangeValues;
  domainMin: number;
  domainMax: number;
  activeSide: RangeSide | null;
  editingSide: RangeSide | null;
  draft: string;
  validationError: string;
  trackRef: RefObject<HTMLDivElement | null>;
  minimumPosition: string;
  maximumPosition: string;
  handleTrackPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  beginDrag: (side: RangeSide, event: PointerEvent<HTMLElement>) => void;
  handleKeyDown: (
    side: RangeSide,
    event: KeyboardEvent<HTMLDivElement>,
  ) => void;
  startEditing: (side: RangeSide) => void;
  setDraft: (draft: string) => void;
  commitDraft: (side: RangeSide) => void;
  cancelEditing: () => void;
}
