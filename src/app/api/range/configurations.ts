import type {
  FixedConfiguration,
  NormalConfiguration,
} from "@/components/RangeDemo/RangeDemo.types";

export async function getNormalRangeConfiguration(): Promise<NormalConfiguration> {
  return { min: 1, max: 100 };
}

export async function getFixedRangeConfiguration(): Promise<FixedConfiguration> {
  return { values: [1.99, 5.99, 10.99, 30.99, 50.99, 70.99] };
}
