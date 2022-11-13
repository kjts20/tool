import type { Options} from 'tsup';

export const tsup: Options = {
    entry: ['src/index.ts'],
    dts: true,
    minify: false,
    splitting: false,
    sourcemap: false,
    clean: true
};
