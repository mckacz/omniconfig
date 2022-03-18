import type { Reference } from './reference'

/**
 * Configuration loader.
 */
export interface Loader<T> {
  /**
   * Load configuration asynchronously.
   */
  load(): Promise<T>

  /**
   * Load configuration synchronously.
   */
  loadSync?(): T

  /**
   * Returns a reference for given configuration object path,
   * or `undefined` if the path is not supported.
   *
   * @param path Path in the same form that Lodash's `get` accepts.
   */
  referenceFor(path: string): Reference | undefined
}

