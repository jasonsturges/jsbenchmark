import { comma } from "../utils/utils";
import { TestResult } from "./TestResult";

/**
 * Collection of test results
 */
export class TestResultSet {
  private readonly _results?: TestResult[] | undefined;

  constructor() {
    this._results = [];
  }

  /**
   * Add a test result to the result set.
   * @param result
   */
  public add(result: TestResult | undefined) {
    if (!result) return;

    this._results?.push(result);
  }

  /**
   * Calculate average total time across the result set.
   */
  public get averageTime(): number {
    if (!this._results) return Number.NEGATIVE_INFINITY;

    let t: number = 0;

    this._results?.forEach((result) => {
      t += result.totalTime;
    });

    return t / this._results.length;
  }

  /**
   * Calculate average operations per second across the result set.
   */
  public get averageOpsPerSecond(): number {
    if (!this._results) return Number.NEGATIVE_INFINITY;
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
    if (!this._results) return Number.NEGATIVE_INFINITY;
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
    if (!this._results) return Number.NEGATIVE_INFINITY;
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
