import { DataContainer } from '../dataContainers/dataContainer'
import { MergedDataContainer } from '../dataContainers/mergedDataContainer'
import { BaseResolver } from './baseResolver'
import { ResolverError } from './resolverError'

/**
 * Asynchronous resolver.
 */
export class AsyncResolver<T = unknown> extends BaseResolver<T, Promise<T>> {
  /**
   * Loads and validates the configuration.
   * Returns final configuration object.
   */
  async resolve(): Promise<T> {
    const sources = await this.load()
    const resolved = await this.validate(sources)

    return resolved
  }

  /**
   * Loads configurations using loaders.
   */
  private async load(): Promise<DataContainer<unknown>> {
    const sources: DataContainer<unknown>[] = []

    for (const loader of this.loaders) {
      try {
        sources.push(await loader.load())
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
  private async validate(dataContainer: DataContainer<unknown>): Promise<T> {
    let value = dataContainer.value as T

    if (this.model) {
      try {
        value = await this.model.validate(value)
      } catch (ex) {
        throw this.decorateError(ex, dataContainer)
      }
    }

    return value
  }
}
