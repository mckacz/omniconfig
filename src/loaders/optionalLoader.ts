import type { Loader, Reference } from './loader.js'

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
   * Load the configuration and return it,
   * or return `undefined` if the inner loader fails.
   */
  load(): T | undefined {
    try {
      return this.loader.load()
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
