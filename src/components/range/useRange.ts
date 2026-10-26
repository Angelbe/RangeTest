"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type {
  RangeProps,
  RangeSide,
  RangeValues,
  UseRangeResult,
} from "./types";
import {
  calculatePercentage,
  clampValue,
  formatValue,
  getNearestFixedValue,
} from "./utils";

export function useRange(props: RangeProps): UseRangeResult {
  const { mode, initialValues } = props;
  const fixedValues = mode === "fixed" ? props.values : undefined;
  const options = useMemo(
    () =>
      fixedValues ? [...fixedValues].sort((first, second) => first - second) : [],
    [fixedValues],
  );
  const domainMin = mode === "normal" ? props.min : options[0];
  const domainMax =
    mode === "normal" ? props.max : options[options.length - 1];

  if (
    domainMin === undefined ||
    domainMax === undefined ||
    !Number.isFinite(domainMin) ||
    !Number.isFinite(domainMax) ||
    domainMin >= domainMax ||
    (mode === "fixed" &&
      (options.length < 2 || options.some((value) => !Number.isFinite(value))))
  ) {
    throw new RangeError("Range requires an increasing, finite domain.");
  }

  const startingValues: RangeValues = initialValues ?? [domainMin, domainMax];
  if (
    startingValues[0] < domainMin ||
    startingValues[1] > domainMax ||
    startingValues[0] > startingValues[1] ||
    (mode === "fixed" &&
      (!options.includes(startingValues[0]) ||
        !options.includes(startingValues[1])))
  ) {
    throw new RangeError("Initial range values must be valid for the domain.");
  }

  const [selected, setSelected] = useState<RangeValues>(startingValues);
  const [activeSide, setActiveSide] = useState<RangeSide | null>(null);
  const [editingSide, setEditingSide] = useState<RangeSide | null>(null);
  const [draft, setDraft] = useState("");
  const [validationError, setValidationError] = useState("");
  const trackRef = useRef<HTMLDivElement>(null);
  const dragSideRef = useRef<RangeSide | null>(null);

  const valueFromPointer = useCallback(
    (clientX: number, side: RangeSide, current: RangeValues) => {
      const bounds = trackRef.current?.getBoundingClientRect();
      if (!bounds || bounds.width === 0) {
        return current[side === "minimum" ? 0 : 1];
      }

      const fraction = clampValue(
        (clientX - bounds.left) / bounds.width,
        0,
        1,
      );
      const rawValue = domainMin + fraction * (domainMax - domainMin);
      const candidate =
        mode === "fixed"
          ? getNearestFixedValue(options, rawValue)
          : Number(rawValue.toFixed(2));

      return side === "minimum"
        ? clampValue(candidate, domainMin, current[1])
        : clampValue(candidate, current[0], domainMax);
    },
    [domainMax, domainMin, mode, options],
  );

  const updateFromPointer = useCallback(
    (clientX: number, side: RangeSide) => {
      setSelected((current) => {
        const next = [...current] as RangeValues;
        next[side === "minimum" ? 0 : 1] = valueFromPointer(
          clientX,
          side,
          current,
        );
        return next;
      });
    },
    [valueFromPointer],
  );

  const beginDrag = (side: RangeSide, event: PointerEvent<HTMLElement>) => {
    event.preventDefault();
    dragSideRef.current = side;
    setActiveSide(side);
    updateFromPointer(event.clientX, side);
  };

  useEffect(() => {
    if (!activeSide) return;

    const documentElement = document.documentElement;
    documentElement.classList.add("range-dragging");

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      const side = dragSideRef.current;
      if (side) updateFromPointer(event.clientX, side);
    };
    const finishDragging = () => {
      dragSideRef.current = null;
      setActiveSide(null);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDragging);
    window.addEventListener("pointercancel", finishDragging);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDragging);
      window.removeEventListener("pointercancel", finishDragging);
      documentElement.classList.remove("range-dragging");
    };
  }, [activeSide, updateFromPointer]);

  const handleTrackPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = trackRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;

    const pointerValue =
      domainMin +
      clampValue((event.clientX - bounds.left) / bounds.width, 0, 1) *
        (domainMax - domainMin);
    const side: RangeSide =
      Math.abs(pointerValue - selected[0]) <=
      Math.abs(pointerValue - selected[1])
        ? "minimum"
        : "maximum";
    beginDrag(side, event);
  };

  const setSideValue = (side: RangeSide, requested: number) => {
    setSelected((current) => {
      const next = [...current] as RangeValues;
      const index = side === "minimum" ? 0 : 1;
      const candidate =
        mode === "fixed"
          ? getNearestFixedValue(options, requested)
          : requested;
      next[index] =
        side === "minimum"
          ? clampValue(candidate, domainMin, current[1])
          : clampValue(candidate, current[0], domainMax);
      return next;
    });
  };

  const startEditing = (side: RangeSide) => {
    setDraft(formatValue(selected[side === "minimum" ? 0 : 1]));
    setValidationError("");
    setEditingSide(side);
  };

  const commitDraft = (side: RangeSide) => {
    const value = Number(draft);
    const otherValue = selected[side === "minimum" ? 1 : 0];
    const upperBound = side === "minimum" ? otherValue : domainMax;
    const lowerBound = side === "minimum" ? domainMin : otherValue;

    if (
      draft.trim() === "" ||
      !Number.isFinite(value) ||
      value < lowerBound ||
      value > upperBound
    ) {
      setValidationError(
        `Enter a value between ${formatValue(lowerBound)} and ${formatValue(upperBound)}.`,
      );
      return;
    }

    setSideValue(side, value);
    setValidationError("");
    setEditingSide(null);
  };

  const cancelEditing = () => {
    setValidationError("");
    setEditingSide(null);
  };

  const handleKeyDown = (
    side: RangeSide,
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    const index = side === "minimum" ? 0 : 1;
    const currentValue = selected[index];
    const lowerBound = side === "minimum" ? domainMin : selected[0];
    const upperBound = side === "minimum" ? selected[1] : domainMax;
    let target: number | undefined;

    if (event.key === "Home") target = lowerBound;
    if (event.key === "End") target = upperBound;

    if (mode === "fixed") {
      const available = options.filter(
        (value) => value >= lowerBound && value <= upperBound,
      );
      const currentIndex = available.indexOf(currentValue);
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        target = available[Math.min(available.length - 1, currentIndex + 1)];
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        target = available[Math.max(0, currentIndex - 1)];
      }
    } else {
      const step = event.shiftKey ? 10 : 1;
      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        target = Math.min(upperBound, currentValue + step);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        target = Math.max(lowerBound, currentValue - step);
      }
    }

    if (target !== undefined) {
      event.preventDefault();
      setSideValue(side, target);
    }
  };

  return {
    mode,
    selected,
    domainMin,
    domainMax,
    activeSide,
    editingSide,
    draft,
    validationError,
    trackRef,
    minimumPosition: `${calculatePercentage(selected[0], domainMin, domainMax)}%`,
    maximumPosition: `${calculatePercentage(selected[1], domainMin, domainMax)}%`,
    handleTrackPointerDown,
    beginDrag,
    handleKeyDown,
    startEditing,
    setDraft: (value) => {
      setDraft(value);
      setValidationError("");
    },
    commitDraft,
    cancelEditing,
  };
}
