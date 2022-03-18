import { comma } from "../utils/utils";

export class TestResult {
  private _startTime?: number | undefined;
  private _endTime?: number | undefined;

  /**
   * Number of operations to execute per pass
   */
  public operations?: number | undefined;

  public getTimer(): number {
    if (typeof window !== "undefined") {
      return performance.now();
    }

    return new Date().getTime();
  }

  /**
   * Mark start of test
   */
  public start(): void {
    this._startTime = this.getTimer();
  }

  /**
   * Mark end of test
   */
  public stop(): void {
    this._endTime = this.getTimer();
  }

  /**
   * Calculate the total time
   */
  public get totalTime(): number {
    if (this._endTime && this._startTime) {
      return this._endTime - this._startTime;
    }

    return Number.POSITIVE_INFINITY;
  }

  /**
   * Calculate operations per second
   */
  public get opsPerSecond(): number {
    if (this.operations) {
      return (1000 / this.totalTime) * this.operations;
    }

    return 0;
  }

  /**
   * Log test result to the console
   */
  public log(): void {
    console.log(`\
    total time: ${this.totalTime.toFixed(5)}\
    ops/second: ${comma(this.opsPerSecond.toFixed())}
    `);
  }
}
