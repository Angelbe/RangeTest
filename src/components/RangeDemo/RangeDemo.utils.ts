import type {
  FixedConfiguration,
  NormalConfiguration,
} from "@/components/RangeDemo/RangeDemo.types";

export function isNormalConfiguration(
  value: unknown,
): value is NormalConfiguration {
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

export function isFixedConfiguration(
  value: unknown,
): value is FixedConfiguration {
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
