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


## Defining a Test Suite

To benchmark multiple test cases for comparison, add them to a test suite.

Each test is executed per the number of passes, not exceeding the maximum runtime.

Each pass calls the function for the specified number of times.  For example, ten passes with one million operations invokes the test function one million times per pass for a total of 10,000,000 calls.

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

Output from above example:

```
double not operator
    min: 6.25000    avg: 8.41969    max: 11.04000    ops/second: 123,911,231

or operator
    min: 7.30000    avg: 9.52969    max: 10.75000    ops/second: 107,329,250

signed shift right operator
    min: 7.07500    avg: 10.00412    max: 10.79500    ops/second: 101,645,033

parseInt
    min: 11.74500    avg: 15.21844    max: 16.36500    ops/second: 66,107,377

round
    min: 7.74000    avg: 11.05765    max: 11.87000    ops/second: 91,572,037

floor
    min: 7.85000    avg: 10.78206    max: 12.00000    ops/second: 93,988,418

ceil
    min: 8.81500    avg: 11.52324    max: 12.36500    ops/second: 87,225,180

toFixed
    min: 247.60500    avg: 258.02000    max: 264.34000    ops/second: 3,878,004

Fastest: double not operator
Slowest: toFixed
```

The test is executed for 25 passes, with each pass executing the function 1 million times unless maximum runtime exceeds one second.

Test Suite optional parameters:

| Type | Property | Description |
| --- | --- | --- |
| bool | `async` | Whether tests should be run asynchronously between passes, providing time for garbage collection |
| number | `passes` | Number of passes to execute each test |
| number | `operations` | Number of operations to execute each pass |
| number | `maxRuntime` | Maximum number of milliseconds to execute each test pass |


## Adding tests

There are two methods to add tests:
- `add()` - Add a test function, which is called once per operation
- `addManual()` - Add a test function, called only once in total

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

One advantage of this method is preventing loop optimizations such as hoisting or no-op that effectively render a test invalid.

Example:

```js
let obj = {};

new JSBench.TestSuite()
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

Operation count is still important for reporting purposes, used to calculate operations per second.

Inside the test function, the operation count is passed to the function.  By default, it will use the test suite's operation count:

```js
new JSBench.TestSuite({
  operations: 1000000, // <-- Use default of test suite
})
  .addManual("name", (operations) => {
    for (let i = 0; i < operations; i++) {}
  });

```

Otherwise, explicitly define the operation count:

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

# Comparing Results

In benchmarking, comparison of results is relative within the test suite.

Ultimately the goal is to understand which operation is significantly outside the set - outlier that is much faster, or much slower.

If the intended purpose is to gain insight into true machine operations per second, manually test by defining your own test loops:

Example:

```js
let n = 0;

new JSBench.TestSuite({
  async: true,
  passes: 25,
  operations: 1000000,
  maxRuntime: 30000,
})
  .add("++n", () => {
    return ++n;
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

Output from the above example:

```
++n
    min: 8.15500    avg: 11.28820    max: 12.14500    ops/second:  90,034,364

++n (manual)
    min: 2.06500    avg:  3.33000    max:  4.76000    ops/second: 311,779,625
```

By removing function overhead, the manual operation gives greater insight into actual operation per second.
