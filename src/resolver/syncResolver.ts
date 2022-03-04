import _ from 'lodash'
import { ResolverError } from './resolverError'
import { BaseResolver } from './baseResolver'

/**
 * Synchronous resolver.
 */
export class SyncResolver<T = unknown> extends BaseResolver<T> {
  /**
   * Loads and processes the configuration synchronously.
   * Returns final configuration object.
   */
  resolve(): T {
    const sources = this.load()
    const resolved = this.process(sources)

    return resolved
  }

  /**
   * Loads configurations using loaders.
   */
  private load(): unknown[] {
    const sources: unknown[] = []

    for (const loader of this.loaders) {
      try {
        if (this.assertSync(loader, 'loadSync')) {
          sources.push(loader.loadSync())
        }
      } catch (ex) {
        throw new ResolverError(ex, loader)
      }
    }
    return sources
  }

  /**
   * Merges and processes the configurations using processors.
   *
   * @param sources Source configuration objects.
   */
  private process(sources: unknown[]): T {
    let merged = _.merge({}, ...sources) as T

    for (const processor of this.processors) {
      try {
        if (this.assertSync(processor, 'processSync')) {
          merged = processor.processSync(merged)
        }
      } catch (ex) {
        throw this.decorateError(ex, sources, processor)
      }
    }

    return merged
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
