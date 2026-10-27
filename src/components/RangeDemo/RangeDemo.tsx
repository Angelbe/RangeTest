"use client";

import Range from "@/components/Range";
import type { RangeDemoProps } from "@/components/RangeDemo/RangeDemo.types";
import {
  isFixedConfiguration,
  isNormalConfiguration,
} from "@/components/RangeDemo/RangeDemo.utils";

export default function RangeDemo({
  mode,
  initialConfiguration,
}: RangeDemoProps) {
  const hasNormalConfiguration =
    mode === "normal" && isNormalConfiguration(initialConfiguration);
  const hasFixedConfiguration =
    mode === "fixed" && isFixedConfiguration(initialConfiguration);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
          Interactive component · {mode === "normal" ? "01" : "02"}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {mode === "normal" ? "Continuous range" : "Curated price points"}
        </h1>
        <p className="mt-3 max-w-xl leading-7 text-slate-600">
          {mode === "normal"
            ? "Drag either handle to set a range, or select a value to enter it precisely."
            : "Choose from a set of fixed values. Both handles snap to the nearest available point."}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-10">
        {hasNormalConfiguration ? (
          <Range
            mode="normal"
            min={initialConfiguration.min}
            max={initialConfiguration.max}
            initialValues={[25, 75]}
          />
        ) : hasFixedConfiguration ? (
          <Range
            mode="fixed"
            values={initialConfiguration.values}
            initialValues={[5.99, 50.99]}
          />
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            Range configuration is unavailable.
          </p>
        )}

        <div className="mt-8 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs text-slate-500">
          <span
            aria-hidden="true"
            className="size-2 rounded-full bg-emerald-500"
          />
          {mode === "normal"
            ? "Values are constrained by the service limits."
            : "Only values returned by the service can be selected."}
        </div>
      </div>
    </div>
  );
}
