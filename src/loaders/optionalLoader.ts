import { BasicDataContainer } from '../common/basicDataContainer'
import type { Loader } from '../interfaces/loader'
import type { Reference } from '../interfaces/reference'
import type { DataContainer } from '../interfaces/dataContainer'

/**
 * Optional loader.
 * Decorates the given loader and ignores errors thrown by it.
 */
export class OptionalLoader<T> implements Loader<Partial<T>> {
  constructor(
    private readonly loader: Loader<T>,
  ) {
  }

  /**
   * Load the configuration asynchronously and return it,
   * or return `undefined` if the inner loader fails.
   */
  async load(): Promise<DataContainer<Partial<T>>> {
    try {
      return await this.loader.load()
    } catch {
      return new BasicDataContainer(this.loader, {})
    }
  }

  /**
   * Load the configuration synchronously and return it,
   * or return `undefined` if the inner loader fails.
   */
  loadSync(): DataContainer<Partial<T>> {
    if (!this.loader.loadSync) {
      throw new TypeError(`Loader '${this.loader.constructor.name}' does not support synchronous mode`)
    }

    try {
      return this.loader.loadSync()
    } catch {
      return new BasicDataContainer(this.loader, {})
    }
  }

  /**
   * Returns supported source references for given configuration object path.
   *
   * @param path Path in the same form that Lodash's `get` accepts.
   */
  referencesFor(path: string): Reference[] {
    return this.loader.referencesFor(path)
  }
}
