import type { Loader} from '../interfaces/loader'
import type { Reference } from '../interfaces/reference'

/**
 * Optional loader.
 * Decorates the given loader and ignores errors thrown by it.
 */
export class OptionalLoader<T> implements Loader<T | undefined> {
  constructor(
    private readonly loader: Loader<T>
  ) {
  }

  /**
   * Load the configuration asynchronously and return it,
   * or return `undefined` if the inner loader fails.
   */
  async load(): Promise<T | undefined> {
    try {
      return await this.loader.load()
    } catch {
      // ignore
    }
  }

  /**
   * Load the configuration synchronously and return it,
   * or return `undefined` if the inner loader fails.
   */
  loadSync(): T | undefined {
    if (!this.loader.loadSync) {
      throw new TypeError(`Loader '${this.loader.constructor.name}' does not support synchronous mode`)
    }

    try {
      return this.loader.loadSync()
    } catch {
      // ignore
    }
  }

  /**
   * Return the reference for a given path using the inner loader.
   */
  referenceFor(path: string): Reference | undefined {
    return this.loader.referenceFor(path)
  }
}
