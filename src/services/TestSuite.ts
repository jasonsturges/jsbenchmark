import EventEmitter from "eventemitter3";
import { Test } from "./Test";
import { TestEvent } from "../events/TestEvent";
import { TestResult } from "./TestResult";
import { TestResultSet } from "./TestResultSet";
import { TestSuiteOptions } from "./TestSuiteOptions";
import { TestSuiteResult } from "./TestSuiteResult";
import { sleep } from "../utils/utils";

/**
 * Suite of test cases for comparison.
 */
export class TestSuite extends EventEmitter {
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
   * Constructor
   */
  constructor(options?: Partial<TestSuiteOptions>) {
    super();

    this.async = options?.async ?? true;
    this.passes = options?.passes ?? 5;
    this.operations = options?.operations ?? 1000;
    this.maxRuntime = options?.maxRuntime ?? 1000;

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
   * higher resolution in testing fine-grained operations
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
      let result: TestResult | undefined;

      do {
        ++pass;

        if (test.manual) {
          result = test.runManual();
        } else {
          result = test.run();
        }

        // If time was immeasurable, disregard sample
        if (result?.totalTime === 0) {
          --pass;
        } else {
          resultSet.add(result);
        }

        runtime = Date.now() - startTime;

        this.emit(TestEvent.PASS, { test: test, result: result });

        if (this.async) {
          await sleep(50);
        }
      } while (pass < this.passes && runtime < this.maxRuntime);

      suiteResult.add(test, resultSet);
      this.emit(TestEvent.TEST, { test: test, resultSet: resultSet });
    }

    this.emit(TestEvent.SUITE, { result: suiteResult });
    this.emit(TestEvent.COMPLETE);
    return this;
  }
}
