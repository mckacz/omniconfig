import { ResolverError } from './resolverError'
import { BaseResolver } from './baseResolver'
import { MergedDataContainer } from '../dataContainers/mergedDataContainer'
import { DataContainer } from '../interfaces/dataContainer'

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
   * Processes the configurations using processor.
   *
   * @param dataContainer Data container.
   */
  private async process(dataContainer: DataContainer<unknown>): Promise<T> {
    let value = dataContainer.value as T

    if (this.processor) {
      try {
        value = await this.processor.process(value)
      } catch (ex) {
        throw this.decorateError(ex, dataContainer, this.processor)
      }
    }

    return value
  }
}
