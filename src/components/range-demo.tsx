"use client";

import { useEffect, useState } from "react";
import Range from "@/components/range";

type RangeMode = "normal" | "fixed";
type NormalConfiguration = { min: number; max: number };
type FixedConfiguration = { values: number[] };
type Configuration = NormalConfiguration | FixedConfiguration;

function isNormalConfiguration(value: unknown): value is NormalConfiguration {
  if (typeof value !== "object" || value === null) return false;
  const config = value as Record<string, unknown>;
  return (
    typeof config.min === "number" &&
    Number.isFinite(config.min) &&
    typeof config.max === "number" &&
    Number.isFinite(config.max) &&
    config.min < config.max
  );
}

function isFixedConfiguration(value: unknown): value is FixedConfiguration {
  if (typeof value !== "object" || value === null) return false;
  const config = value as Record<string, unknown>;
  return (
    Array.isArray(config.values) &&
    config.values.length >= 2 &&
    config.values.every(
      (item): item is number => typeof item === "number" && Number.isFinite(item),
    )
  );
}

export default function RangeDemo({ mode }: { mode: RangeMode }) {
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [error, setError] = useState("");
  const endpoint =
    mode === "normal" ? "/api/range/normal" : "/api/range/fixed";

  useEffect(() => {
    const controller = new AbortController();

    async function loadConfiguration() {
      try {
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Range service returned ${response.status}.`);
        }

        const data: unknown = await response.json();
        if (mode === "normal") {
          if (!isNormalConfiguration(data)) {
            throw new Error("Range service returned an invalid configuration.");
          }
          setConfiguration(data);
        } else {
          if (!isFixedConfiguration(data)) {
            throw new Error("Range service returned an invalid configuration.");
          }
          setConfiguration(data);
        }
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === "AbortError") return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load range configuration.",
        );
      }
    }

    void loadConfiguration();
    return () => controller.abort();
  }, [endpoint, mode]);

  const isLoadedConfiguration =
    mode === "normal"
      ? configuration !== null && "min" in configuration
      : configuration !== null && "values" in configuration;

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
        {error ? (
          <p className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700" role="alert">
            {error}
          </p>
        ) : !isLoadedConfiguration ? (
          <p className="py-8 text-center text-sm text-slate-500" role="status">
            Loading range options…
          </p>
        ) : mode === "normal" && configuration && "min" in configuration ? (
          <Range
            mode="normal"
            min={configuration.min}
            max={configuration.max}
            initialValues={[25, 75]}
          />
        ) : mode === "fixed" &&
          configuration &&
          "values" in configuration ? (
          <Range
            mode="fixed"
            values={configuration.values}
            initialValues={[5.99, 50.99]}
          />
        ) : null}

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
