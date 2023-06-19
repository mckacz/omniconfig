import type { Loader} from '../interfaces/loader'
import type { Reference } from '../interfaces/reference'
import type { DataContainer } from '../interfaces/dataContainer'

/**
 * Base class for synchronous-only loaders.
 * Implements asynchronous mode by wrapping synchronous call in a Promise.
 */
export abstract class SyncLoader<T> implements Loader<T> {
  /**
   * Load configuration synchronously.
   */
  abstract loadSync(): DataContainer<T>

  /**
   * Returns supported source references for given configuration object path.
   *
   * @param path Object path parts.
   */
  abstract getReferences(path: string[]): Reference[]

  /**
   * Load configuration asynchronously.
   */
  load(): Promise<DataContainer<T>> {
    return new Promise<DataContainer<T>>((resolve, reject) => {
      try {
        resolve(this.loadSync())
      } catch (ex) {
        reject(ex)
      }
    })
  }
}
