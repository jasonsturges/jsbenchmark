import { TestResult } from "./TestResult";
import { TestOptions } from "./TestOptions";

/**
 * Individual test case to measure execution
 */
export class Test {
  /**
   * Name of the test case
   */
  public name: string | undefined;

  /**
   * Function to be called
   */
  public fn: Function | undefined;

  /**
   * Minimum number of operations to execute each pass
   */
  public operations: number | undefined;

  /**
   * Whether loop operations are manually managed in the test function
   */
  public manual: boolean | undefined;

  /**
   * @constructor
   * @param name - Name of the test case
   * @param fn - Function to be called
   * @param options - Optional parameters
   */
  constructor(name: string, fn: Function, options?: Partial<TestOptions>) {
    this.name = name;
    this.fn = fn;
    this.operations = options?.operations ?? 1000;
    this.manual = options?.manual ?? false;

    return this;
  }

  /**
   * Execute the test, repeating for the specified `operations` count.
   *
   * @returns {TestResult} - Test result of this pass
   */
  public run(): TestResult | undefined {
    if (!this.fn) {
      throw new Error("No test function defined");
    }

    const fn = this.fn;
    const operations = this.operations ?? 1000;
    const result = new TestResult();
    result.operations = operations;
    result.start();

    for (let i = 0; i < operations; i++) {
      fn.call(null, i);
    }

    result.stop();

    return result;
  }

  /**
   * Manual execution, running only once.
   *
   * This enables higher resolution in testing fine-grained
   * operations by manually specifying the test loop.
   *
   * No function overhead is incurred in obtaining test results.
   *
   * Operation count is is preserved for reporting purposes.
   *
   * @returns {TestResult} - Test result of this pass
   */
  public runManual(): TestResult {
    if (!this.fn) {
      throw new Error("No test function defined");
    }

    const { fn } = this;
    const result = new TestResult();
    result.operations = this.operations;

    result.start();
    fn.call(null, this.operations);
    result.stop();

    return result;
  }
}
