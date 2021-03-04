import { TestResult } from "./TestResult";

/**
 * Optional parameters
 */
type Options = {
  operations: number;
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
   * Execute the test, returning `TestResult`
   */
  public run() {
    const { fn } = this;
    const result = new TestResult();
    result.operations = this.operations;
    result.start();

    for (let i = 0; i < this.operations; i++) {
      fn.call(null, i)
    }

    result.stop();

    return result;
  }
}
