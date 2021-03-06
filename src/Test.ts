import { TestResult } from "./TestResult";

/**
 * Optional parameters
 */
type Options = {
  operations: number;
  manual: boolean;
};

/**
 * Individual test case to measure execution
 */
export class Test {
  /**
   * Name of the test case
   */
  public name: string;

  /**
   * Function to be called
   */
  public fn: Function;

  /**
   * Minimum number of operations to execute each pass
   */
  public operations: number = 1000;

  /**
   * Whether loop operations are manually managed in the test function
   */
  public manual: boolean = false;

  /**
   * @constructor
   * @param name - Name of the test case
   * @param fn - Function to be called
   * @param options - Optional parameters
   */
  constructor(name: string, fn: Function, options: Partial<Options> = {}) {
    this.name = name;
    this.fn = fn;

    Object.assign(this, options);

    return this;
  }

  /**
   * Execute the test, repeating for the specified `operations` count.
   *
   * @returns {TestResult} - Test result of this pass
   */
  public run(): TestResult {
    const { fn } = this;
    const result = new TestResult();
    result.operations = this.operations;
    result.start();

    for (let i = 0; i < this.operations; i++) {
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
    const { fn } = this;
    const result = new TestResult();
    result.operations = this.operations;

    result.start();
    fn.call(null, this.operations);
    result.stop();

    return result;
  }
}
