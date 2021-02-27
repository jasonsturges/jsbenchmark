# JS Benchmark
JavaScript performance benchmarking

# Getting Started

To install, execute:

    npm i jsbenchmark

Then, import into a project as:

```js
import * as JSBench from "jsbenchmark";
```

# Usage

This package can test individual functions, or a suite of test cases.

## Individual Test

Single test cases can be executed, per the numer of operations.

```js
import * as JSBench from "jsbenchmark"

new JSBench.Test("Log 10", () => {
    Math.log10(2)
  }, {
    operations: 1000000
  })
  .run()
  .log();
```

The above would output:

```
    total time: 11.28000    ops/second: 88,652,482
```

The test is executed for one pass, executing the function one million times.

Total time for the test was 11.2 milliseconds, resulting in 88 million operations per second


## Test Suite

Multiple test cases can be included into a test suite.

Each test is executed per the numer of passes, not exceeding the maximum runtime.

```js
import * as JSBench from "jsbenchmark"

new JSBench.TestSuite({
      async: true,
      passes: 10,
      operations: 1000000,
      maxRuntime: 1000
  })
  .add("Log10(100000)", () => {
      Math.log10(100000);
  })
  .add("Log10(2)", () => {
      Math.log10(2);
  })
  .add("Log10(1)", () => {
      Math.log10(1);
  })
  .add("Log10(0)", () => {
      Math.log10(0);
  })
  .run()
```

The above would output:

```
Log10(100000)
    min: 10.26000    avg: 11.38071    max: 12.40000    ops/second: 88,177,315

Log10(2)
    min: 7.96500    avg: 11.17047    max: 12.40000    ops/second: 90,171,735
    
Log10(1)
    min: 7.96500    avg: 11.04000    max: 12.60500    ops/second: 91,597,143
    
Log10(0)
    min: 7.96500    avg: 11.13280    max: 12.76000    ops/second: 90,789,885
    
```

The test is executed for ten passes, with each pass executing the function 1 million times.
