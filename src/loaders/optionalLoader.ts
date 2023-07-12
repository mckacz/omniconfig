import { BasicDataContainer } from '../dataContainers/basicDataContainer'
import type { DataContainer } from '../interfaces/dataContainer'
import type { Loader } from '../interfaces/loader'
import type { Reference } from '../interfaces/reference'

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
      return new BasicDataContainer(this.loader, <T>{})
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
      return new BasicDataContainer(this.loader, <T>{})
    }
  }

  /**
   * Returns supported source references for given configuration object path.
   *
   * @param path Object path parts.
   */
  getReferences(path: string[]): Reference[] {
    return this.loader.getReferences(path)
  }
}
