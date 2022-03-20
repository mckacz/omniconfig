import type { DataContainer } from './dataContainer'
import type { Reference } from './reference'

/**
 * Configuration loader.
 */
export interface Loader<T> {
  /**
   * Load configuration asynchronously.
   */
  load(): Promise<DataContainer<T>>

  /**
   * Load configuration synchronously.
   */
  loadSync?(): DataContainer<T>

  /**
   * Returns supported source references for given configuration object path.
   *
   * @param path Path in the same form that Lodash's `get` accepts.
   */
  getReferences(path: string): Reference[]
}

