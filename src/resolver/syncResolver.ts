import { MergedDataContainer } from '../dataContainers/mergedDataContainer'
import { BaseResolver } from './baseResolver'
import { ResolverError } from './resolverError'
import type { DataContainer } from '../dataContainers/dataContainer'

/**
 * Synchronous resolver.
 */
export class SyncResolver<T = unknown> extends BaseResolver<T> {
  /**
   * Loads and validates the configuration synchronously.
   * Returns final configuration object.
   */
  resolve(): T {
    const sources = this.load()
    const resolved = this.validate(sources)

    return resolved
  }

  /**
   * Loads configurations using loaders.
   */
  private load(): DataContainer<unknown> {
    const sources: DataContainer<unknown>[] = []

    for (const loader of this.loaders) {
      try {
        if (this.assertSync(loader, 'loadSync')) {
          sources.push(loader.loadSync())
        }
      } catch (ex) {
        throw new ResolverError(ex, loader)
      }
    }

    return new MergedDataContainer(sources)
  }

  /**
   * Validates the configurations using configured validator.
   *
   * @param dataContainer Data container.
   */
  private validate(dataContainer: DataContainer<unknown>): T {
    let value = dataContainer.value as T

    if (this.model) {
      try {
        if (this.assertSync(this.model, 'validateSync')) {
          value = this.model.validateSync(value)
        }
      } catch (ex) {
        throw this.decorateError(ex, dataContainer)
      }
    }

    return value
  }

  /**
   * Asserts that a given method is implemented in the object.
   *
   * @param thing Object to check
   * @param method Method name to check
   */
  private assertSync<U extends object, M extends keyof U>(thing: U, method: M): thing is U & Required<Pick<U, M>> {
    if (typeof thing[method] !== 'function') {
      throw new TypeError(`'${thing.constructor.name}' does not support synchronous mode`)
    }

    return true
  }
}
