import { Processor } from './processor'

/**
 * Base class for synchronous-only processors.
 * Implements asynchronous mode by wrapping synchronous call in a Promise.
 */
export abstract class SyncProcessor<T, U> implements Processor<T, U> {
  /**
   * Processes the data synchronously.
   *
   * @param payload Data to process.
   */
  abstract processSync(payload: T): U

  /**
   * Processes the data asynchronously.
   *
   * @param payload Data to process.
   */
  process(payload: T): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      try {
        resolve(this.processSync(payload))
      } catch (ex) {
        reject(ex)
      }
    })
  }
}
