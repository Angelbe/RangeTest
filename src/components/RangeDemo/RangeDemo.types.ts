export type RangeMode = "normal" | "fixed";

export type NormalConfiguration = {
  min: number;
  max: number;
};

export type FixedConfiguration = {
  values: number[];
};

export type Configuration = NormalConfiguration | FixedConfiguration;

export interface RangeDemoProps {
  mode: RangeMode;
  initialConfiguration?: Configuration | null;
}
