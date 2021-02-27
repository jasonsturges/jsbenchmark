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
    total time: 10.31500    ops/second: 96,946,195
```

The test is executed for one pass, executing the function one million times.

Total time for the test was ~10 milliseconds, resulting in ~97 million operations per second


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
  .on("test", (event) => {
      const test = event.test;
      const resultSet = event.resultSet;
      console.log(test.name)
      resultSet.log();
  })
  .on("suite", (event) => {
      const suiteResult = event.result;
      suiteResult.log();
  })
  .run()
```

The above would output:

```
Log10(100000)
     min: 8.07500    avg: 9.08600    max: 10.39000    ops/second: 110,917,308

Log10(2)
     min: 6.98500    avg: 8.55900    max: 10.39000    ops/second: 118,257,790

Log10(1)
     min: 6.98500    avg: 8.84733    max: 12.13000    ops/second: 115,240,134

Log10(0)
     min: 6.98500    avg: 9.54700    max: 12.54000    ops/second: 108,184,087

Fastest: Log10(100000)
Slowest: Log10(0)
```

The test is executed for ten passes, with each pass executing the function 1 million times unless maximum runtime exceeds one second.

# Events

On each pass of a test, use the `pass` event:

```js
  .on("pass", (event) => {
      const test = event.test;
      const result = event.result;

      console.log(test.name)
      result.log();
  })
```

This returns the test, and test result (`TestResult`) for that pass.

On completion of each test, use the `test` event:

```js
  .on("test", (event) => {
      const test = event.test;
      const resultSet = event.resultSet;

      console.log(test.name)
      resultSet.log();
  })
```

This returns the test, and test result set (`TestResultSet`) for all passes of the test.

On completion of all tests in the test suite, use the `suite` event:

```js
  .on("suite", (event) => {
      const result = event.result;

      result.log();
  })
```

This returns the test suite result (`TestSuiteResult`) for all tests in in the test suite.
