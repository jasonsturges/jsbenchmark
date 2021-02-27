export class TestResult {
  private _startTime: number;
  private _endTime: number;

  /**
   * Number of operations to execute per pass
   */
  public operations: number;

  /**
   * Mark start of test
   */
  public start(): void {
    this._startTime = performance.now();
  }

  /**
   * Mark end of test
   */
  public stop(): void {
    this._endTime = performance.now();
  }

  /**
   * Calculate the total time
   */
  public get totalTime(): number {
    return this._endTime - this._startTime;
  }

  /**
   * Calculate operations per second
   */
  public get opsPerSecond(): number {
    return (1000 / this.totalTime) * this.operations;
  }
}
