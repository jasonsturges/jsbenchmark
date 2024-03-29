import { Test } from "./Test";
import { TestResultSet } from "./TestResultSet";

/**
 * All test result sets in a test suite;
 */
export class TestSuiteResult {
  /**
   * Results from all tests in the test suite
   */
  public readonly results?: Map<Test, TestResultSet> | undefined;

  constructor() {
    this.results = new Map<Test, TestResultSet>();
  }

  /**
   * Add a test result set to the result set.
   */
  public add(test: Test, resultSet: TestResultSet) {
    this.results?.set(test, resultSet);
  }

  /**
   * Find the fastest result in the test suite
   */
  public fastest(): Test | undefined {
    if (!this.results) {
      throw new Error("No results");
    }

    let ops: Number = Number.NEGATIVE_INFINITY;
    let t: Test | undefined;

    for (const [test, result] of this.results) {
      if (result.averageOpsPerSecond > ops) {
        ops = result.averageOpsPerSecond;
        t = test;
      }
    }

    return t;
  }

  /**
   * Find the slowest result in the test suite
   */
  public slowest(): Test | undefined {
    if (!this.results) {
      throw new Error("No results");
    }

    let ops: Number = Number.POSITIVE_INFINITY;
    let t: Test | undefined;

    for (const [test, result] of this.results) {
      if (result.averageOpsPerSecond < ops) {
        ops = result.averageOpsPerSecond;
        t = test;
      }
    }

    return t;
  }

  /**
   * Log a result to the console
   */
  public log(): void {
    console.log(`Fastest: ${this.fastest()?.name}`);
    console.log(`Slowest: ${this.slowest()?.name}`);
  }
}
