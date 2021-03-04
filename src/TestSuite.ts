import { EventDispatcher } from "./EventDispatcher";
import { Test } from "./Test";
import { TestEvent } from "./TestEvent";
import { TestResult } from "./TestResult";
import { TestResultSet } from "./TestResultSet";
import { TestSuiteResult } from "./TestSuiteResult";
import { sleep } from "./utils";

/**
 * Optional parameters
 */
type Options = {
  async: boolean;
  passes: number;
  operations: number;
  maxRuntime: number;
};

/**
 * Suite of test cases for comparison.
 */
export class TestSuite extends EventDispatcher {
  private queue: Set<Test> = new Set<Test>();

  /**
   * Whether tests should be run asynchronously between passes.
   * This provides time for garbage collection.
   */
  public async: boolean = true;

  /**
   * Maximum number of milliseconds to execute each test pass.
   */
  public maxRuntime: number = 1000;

  /**
   * Minimum number of operations to execute each pass
   */
  public operations: number = 1000;

  /**
   * Number of passes to execute each test.
   *
   * For each pass, the minimum operations of the test case
   * will be executed.
   */
  public passes: number = 5;

  /**
   * @constructor
   * @param options
   */
  constructor(options: Partial<Options> = {}) {
    super();

    this.async = options.async;
    this.passes = options.passes;
    this.operations = options.operations;
    this.maxRuntime = options.maxRuntime;

    Object.assign(this, options);

    return this;
  }

  /**
   * Add a test case to the test suite.
   * @param name - Name of the test case
   * @param fn - Function to be called
   */
  public add(name: string, fn: Function) {
    const test = new Test(name, fn, {
      operations: this.operations,
    });
    this.queue.add(test);

    return this;
  }

  /**
   * Add a test case specifying a manual loop for
   * higher resolution in testing fine grained operations
   * by manually specifying the test loop.
   */
  public addManual(name: string, fn: Function, operations: number) {
    const test = new Test(name, fn, {
      operations: operations ?? this.operations,
      manual: true,
    });
    this.queue.add(test);

    return this;
  }

  /**
   * Execute all tests in the test suite
   */
  public async run() {
    const suiteResult = new TestSuiteResult();

    for (let test of this.queue) {
      // Test result set, containing all passes
      const resultSet = new TestResultSet();

      let pass: number = 0;
      let runtime: number = 0;
      let startTime: number = Date.now();
      let result: TestResult;

      do {
        ++pass;

        if (test.manual) {
          result = test.runManual();
        } else {
          result = test.run();
        }

        // If time was immeasurable, disregard sample
        if (result.totalTime === 0) {
          --pass;
        } else {
          resultSet.add(result);
        }

        runtime = Date.now() - startTime;

        this.dispatch({ type: TestEvent.PASS, test: test, result: result });

        if (this.async) {
          await sleep(50);
        }
      } while (pass < this.passes && runtime < this.maxRuntime);

      suiteResult.add(test, resultSet);
      this.dispatch({ type: TestEvent.TEST, test: test, resultSet: resultSet });
    }

    this.dispatch({ type: TestEvent.SUITE, result: suiteResult });
    this.dispatch({ type: TestEvent.COMPLETE });
    return this;
  }
}
