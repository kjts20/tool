import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["src/**/*.ts"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true
};