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
  constructor(
    name: string,
    fn: Function,
    options: Options = { operations: 1000 }
  ) {
    this.name = name;
    this.fn = fn;
    this.operations = options.operations;

    return this;
  }

  /**
   * Execute the test, returning `TestResult`
   */
  public run() {
    const result = new TestResult();
    result.operations = this.operations;
    result.start();

    for (let i = 0; i < this.operations; i++) {
      this.fn.call();
    }

    result.stop();

    return result;
  }
}
