/**
 * Processes (transforms/validates) configuration.
 */
export interface Processor<T, U> {
  /**
   * Processes the data.
   *
   * @param data Data to process.
   */
  process(data: T): U | Promise<U>
}
