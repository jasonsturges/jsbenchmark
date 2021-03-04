import { comma } from "./utils";
import { TestResult } from "./TestResult";

/**
 * Collection of test results
 */
export class TestResultSet {
  private _results: TestResult[] = [];

  /**
   * Add a test result to the result set.
   * @param result
   */
  public add(result: TestResult) {
    this._results.push(result);
  }

  /**
   * Calculate average total time across the result set.
   */
  public get averageTime(): number {
    let t: number = 0;

    this._results.forEach((result) => {
      t += result.totalTime;
    });

    return t / this._results.length;
  }

  /**
   * Calculate average operations per second across the result set.
   */
  public get averageOpsPerSecond(): number {
    let ops: number = 0;

    this._results.forEach((result) => {
      ops += result.opsPerSecond;
    });

    return ops / this._results.length;
  }

  /**
   * Calculate maximum execution time across the result set.
   */
  public get maxTime(): number {
    let t: number = Number.NEGATIVE_INFINITY;

    this._results.forEach((result) => {
      if (result.totalTime > t) t = result.totalTime;
    });

    return t;
  }

  /**
   * Calculate minimum execution time across the result set.
   */
  public get minTime(): number {
    let t: number = Number.POSITIVE_INFINITY;

    this._results.forEach((result) => {
      if (result.totalTime < t) t = result.totalTime;
    });

    return t;
  }

  /**
   * Log a result to the console
   */
  public log(): void {
    console.log(`\
    min: ${this.minTime.toFixed(5)}\
    avg: ${this.averageTime.toFixed(5)}\
    max: ${this.maxTime.toFixed(5)}\
    ops/second: ${comma(this.averageOpsPerSecond.toFixed())}
    `);
  }
}
