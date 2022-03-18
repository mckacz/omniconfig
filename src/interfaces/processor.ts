/**
 * Processes (transforms/validates) configuration.
 */
export interface Processor<T, U> {
  /**
   * Processes the data asynchronously.
   *
   * @param data Data to process.
   */
  process(data: T): Promise<U>

  /**
   * Processes the data synchronously.
   *
   * @param data Data to process.
   */
  processSync?(data: T): U
}
