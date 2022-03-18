import { Loader} from '../interfaces/loader'
import type { Reference } from '../interfaces/reference'

/**
 * Base class for synchronous-only loaders.
 * Implements asynchronous mode by wrapping synchronous call in a Promise.
 */
export abstract class SyncLoader<T> implements Loader<T> {
  /**
   * Load configuration synchronously.
   */
  abstract loadSync(): T

  /**
   * Returns a reference for given configuration object path,
   * or `undefined` if the path is not supported.
   *
   * @param path Path in the same form that Lodash's `get` accepts.
   */
  abstract referenceFor(path: string): Reference | undefined

  /**
   * Load configuration asynchronously.
   */
  load(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        resolve(this.loadSync())
      } catch (ex) {
        reject(ex)
      }
    })
  }
}
