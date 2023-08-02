import type { DataContainer } from '../dataContainers/dataContainer'
import type { Reference } from '../dataContainers/reference'

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

