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
   * @param path Object path parts.
   */
  getReferences(path: string[]): Reference[]
}

