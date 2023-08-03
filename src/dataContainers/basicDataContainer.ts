import type { DataContainer } from './dataContainer'
import type { Reference } from './reference'
import type { Loader } from '../loaders/loader'

/**
 * Data container that resolves path reference from a loader.
 */
export class BasicDataContainer<T> implements DataContainer<T> {
  constructor(
    readonly loader: Loader<T>,
    readonly value: T,
  ) {
  }

  /**
   * Returns a reference for given configuration object path,
   * or `undefined` if the path is not supported.
   *
   * @param path Object path parts.
   */
  getDefinition(path: string[]): Reference | undefined {
    const references = this.loader.getReferences(path)

    if (references.length > 1) {
      throw new TypeError('BasicDataContainer does not support compound Loaders')
    }

    return references[0]
  }
}
