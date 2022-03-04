import _ from 'lodash'
import { ResolverError } from './resolverError'
import { BaseResolver } from './baseResolver'

/**
 * Asynchronous resolver.
 */
export class AsyncResolver<T = unknown> extends BaseResolver<T, Promise<T>> {
  /**
   * Loads and processes the configuration.
   * Returns final configuration object.
   */
  async resolve(): Promise<T> {
    const sources = await this.load()
    const resolved = await this.process(sources)

    return resolved
  }

  /**
   * Loads configurations using loaders.
   */
  private async load(): Promise<unknown[]> {
    const sources: unknown[] = []

    for (const loader of this.loaders) {
      try {
        sources.push(await loader.load())
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
  private async process(sources: unknown[]): Promise<T> {
    let merged = _.merge({}, ...sources) as T

    for (const processor of this.processors) {
      try {
        merged = await processor.process(merged)
      } catch (ex) {
        throw this.decorateError(ex, sources, processor)
      }
    }

    return merged
  }
}
