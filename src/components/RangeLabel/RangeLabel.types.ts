import type {
  RangeProps,
  RangeSide,
  RangeValues,
} from "@/components/Range/Range.types";

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
