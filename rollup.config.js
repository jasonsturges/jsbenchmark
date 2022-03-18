import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: "jsbenchmark",
      file: pkg.browser,
      format: "umd",
      sourcemap: true,
      globals: { eventemitter3: "EventEmitter" },
    },
    external: ["eventemitter3"],
    plugins: [
      resolve(), //
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true },
      { file: pkg.module, format: "es", sourcemap: true },
    ],
    external: ["eventemitter3"],
    plugins: [typescript({ tsconfig: "./tsconfig.json" })],
  },
];
