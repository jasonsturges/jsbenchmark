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

This package can benchmark individual tests, or a suite of test cases for comparison.


## Test Suite

To benchmark multiple test cases for comparison, add them into a test suite.

Each test is executed per the number of operations each pass, not exceeding the maximum runtime.

Each pass calls the function for the specified number of times.  Ten passes with one million operations invokes the test function one million times per pass for a total of 10,000,000 calls.

Example test suite: Drop decimal from number

```js
import * as JSBench from "jsbenchmark";

new JSBench.TestSuite({
  async: true,
  passes: 25,
  operations: 1000000,
  maxRuntime: 1000,
})
  .add("double not operator", () => {
    ~~Math.PI;
  })
  .add("or operator", () => {
    Math.PI | 0;
  })
  .add("signed shift right operator", () => {
    Math.PI >> 0;
  })
  .add("parseInt", () => {
    parseInt(Math.PI);
  })
  .add("round", () => {
    Math.round(Math.PI);
  })
  .add("floor", () => {
    Math.floor(Math.PI);
  })
  .add("ceil", () => {
    Math.ceil(Math.PI);
  })
  .add("toFixed", () => {
    Math.PI.toFixed();
  })
  .on("test", (event) => {
    const test = event.test;
    const resultSet = event.resultSet;
    console.log(test.name);
    resultSet.log();
  })
  .on("suite", (event) => {
    const suiteResult = event.result;
    suiteResult.log();
  })
  .run();

```

In the example above, each pass calls the function

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

Optional parameters:

| Type | Property | Description |
| --- | --- | --- |
| bool | `async` | Whether tests should be run asynchronously between passes, providing time for garbage collection |
| number | `passes` | Number of passes to execute each test |
| number | `operations` | Number of operations to execute each pass |
| number | `maxRuntime` | Maximum number of milliseconds to execute each test pass |


## Adding tests

There are two methods to add tests:
- `add()` - Add a test function, which is called once per operation
- `addManual()` - Add a test function called only once in total

### Add Test

Using the `add()` function wraps a segment of code to be called once per operation, passing the current operation index into the test function.

Example:

```js
let obj = {};

new JSBench.TestSuite({
  async: true,
  passes: 25,
  operations: 1000000,
  maxRuntime: 30000,
})
  .add("obj[i] = i", (i) => {
    obj[i] = i;
  })
```

Above, the segment of code to be benchmarked is `obj[i] = i`, where `i` is the current index of the operation.

For 25 passes, the function will be called in a loop 1,000,000 times with `i` incrementing from 0 to 999,999.

Each pass is timed, with the result set reporting min, max, and average times.  Operations per second are calculated based upon the average time.

Method signature: `add(name, fn)`

| Type | Parameter | Description |
| --- | --- | --- |
| string | `name` | Name of the test case |
| function | `fn` | Function to be tested |

One advantage of this method is preventing loop optimizations such as hoisting or no-op that effectively render a test useless.

Example:

```js
  .add("obj.hasOwnProperty(i);", (i) => {
    obj.hasOwnProperty(i);
  })
  .add("i in obj", (i) => {
    i in obj;
  })
```

In the example above:
- `hasOwnProperty()` will be invoked and measured
- `i in obj` is effectively a no-op as its return value is never used; therefore, not measured

An easy solution is to return the value:

```js
  .add("i in obj", (i) => {
    return i in obj;
  })
```

Advantages:
- Clear definition of code
- Helps prevent loop optimizations, such as hoisting or no-op

Disadvantages:
- Function overhead per operation, as code is invoked using `call()`
- Higher variance in results due to function invocation


### Add Manual Test

Instead of using the built-in loop, specify your own test loop using `addManual()`.

This enables higher resolution for testing fine-grained operations.

Example:

```js
let n = 0;

new JSBench.TestSuite({
  async: true,
  passes: 25,
  operations: 1000000,
  maxRuntime: 30000,
})
  .addManual(
    "++n (manual)",
    (operations) => {
      for (let i = 0; i < operations; i++) {
        ++n;
      }
    },
    1000000
  )
```

Above, the segment of code to be benchmarked (`++n`) is so small, greater accuracy of operations per second require manually setting up the test loop.

For 25 passes, the test function is executed only once per pass.

Method signature: `addManual(name, fn, operations)`

| Type | Parameter | Description |
| --- | --- | --- |
| string | `name` | Name of the test case |
| function | `fn` | Function to be tested |
| number | `operations` | Number of operations being tested |

Operation count is still import for reporting purposes, used to calculate operations per second.

Inside the test function, the operation count is passed to the function.  By default, it will use the test suite's operation count:

```js
new JSBench.TestSuite({
  operations: 1000000, // <-- Use default of test suite
})
  .addManual("name", (operations) => {
    for (let i = 0; i < operations; i++) {}
  });

```

Otherwise, explicitly define operation count:

```js
new JSBench.TestSuite({
  operations: 1000000,
})
  .addManual(
    "name",
    (operations) => {
      for (let i = 0; i < operations; i++) {}
    },
    10000 // <!-- Use paremeter
  );

```

Advantages:
- Higher resolution of fine-grained segments of code
- Greater accuracy of operations per second, without inclusion of function overhead
- Less variance per pass

Disadvantages:
- Code is less clear
- Responsible for number of operations for reports to calculate operations per second
- Risk of loop optimizations, such as hoisting or no-op.


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

Finally, on completion, use the `complete` event:

```js
  .on("complete", () => {
    console.log("All tests complete.");
  })
```
