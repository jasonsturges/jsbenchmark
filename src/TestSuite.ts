import { sleep } from "./utils";
import { Test } from "./Test";
import { TestResultSet } from "./TestResultSet";

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
export class TestSuite {
  private queue: Set<Test> = new Set<Test>();

  /**
   * Whether tests should be run asynchronously between passes.
   */
  public async: boolean = true;

  /**
   * Number of passes to execute each test.
   *
   * For each pass, the minimum operations of the test case
   * will be executed.
   */
  public passes: number = 5;

  /**
   * Minimum number of operations to execute each pass
   */
  public operations: number = 1000;

  /**
   * Maximum number of milliseconds to execute each test pass.
   */
  public maxRuntime: number = 1000;

  /**
   * @constructor
   * @param options
   */
  constructor(
    options: Options = {
      async: true,
      passes: 5,
      operations: 1000,
      maxRuntime: 1000,
    }
  ) {
    this.async = options.async;
    this.passes = options.passes;
    this.operations = options.operations;
    this.maxRuntime = options.maxRuntime;

    return this;
  }

  /**
   * Add a test case to the test suite.
   * @param name - Name of the test case
   * @param fn - Function to be called
   */
  public add(name: string, fn: Function) {
    const test = new Test(name, fn, { operations: this.operations });
    this.queue.add(test);

    return this;
  }

  /**
   * Execute all tests in the test suite
   */
  public async run() {
    const resultSet = new TestResultSet();

    for (let test of this.queue) {
      console.log(test.name);

      let pass: number = 0;
      let runtime: number = 0;
      let start = Date.now();

      do {
        ++pass;
        runtime = Date.now() - start;

        const result = test.run();

        // If time was immeasurable, disregard sample
        if (result.totalTime === 0) {
          --pass;
        } else {
          resultSet.add(result);
        }

        if (this.async) {
          await sleep(50);
        }
      } while (pass < this.passes && runtime < this.maxRuntime);

      resultSet.log();
    }

    return this;
  }
}
