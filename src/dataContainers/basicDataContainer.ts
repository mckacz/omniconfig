import type { Loader } from '../interfaces/loader'
import type { Reference } from '../interfaces/reference'
import type { DataContainer } from '../interfaces/dataContainer'

/**
 * Data container that resolves path reference from a loader.
 */
export class BasicDataContainer<T> implements DataContainer<T> {
  constructor(
    readonly loader: Loader<T>,
    readonly value: T,
  ) {
  }

  getDefinition(path: string[]): Reference | undefined {
    const references = this.loader.getReferences(path)

    if (references.length > 1) {
      throw new TypeError('BasicDataContainer does not support compound Loaders')
    }

    return references[0]
  }
}
