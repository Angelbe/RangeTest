export function formatValue(value: number): string {
  return String(Number(value.toFixed(2)));
}

export function calculatePercentage(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return ((value - minimum) / (maximum - minimum)) * 100;
}

export function getNearestFixedValue(values: number[], requested: number): number {
  return values.reduce((nearest, value) =>
    Math.abs(value - requested) < Math.abs(nearest - requested)
      ? value
      : nearest,
  );
}

export function clampValue(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.max(minimum, Math.min(maximum, value));
}
