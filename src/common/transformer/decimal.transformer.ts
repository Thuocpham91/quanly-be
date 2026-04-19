import { ValueTransformer } from "typeorm";

export const DecimalTransformer: ValueTransformer = {
  to: (value: number | null): number | null => value ?? null,

  from: (value: string | null): number | null => (value !== null && value !== undefined ? parseFloat(value) : null),
};
