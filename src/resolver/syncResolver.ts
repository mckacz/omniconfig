import { ResolverError } from './resolverError'
import { BaseResolver } from './baseResolver'
import { MergedDataContainer } from '../dataContainers/mergedDataContainer'
import type { DataContainer } from '../interfaces/dataContainer'

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

    if (this.validator) {
      try {
        if (this.assertSync(this.validator, 'validateSync')) {
          value = this.validator.validateSync(value)
        }
      } catch (ex) {
        throw this.decorateError(ex, dataContainer, this.validator)
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
  private assertSync<T extends object, M extends keyof T>(thing: T, method: M): thing is T & Required<Pick<T, M>> {
    if (typeof thing[method] !== 'function') {
      throw new TypeError(`'${thing.constructor.name}' does not support synchronous mode`)
    }

    return true
  }
}
