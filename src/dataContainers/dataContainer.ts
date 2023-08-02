import type { Reference } from './reference'

/**
 * Represents loaded configuration object.
 */
export interface DataContainer<T> {
  /**
   * Value hold by this data object.
   */
  readonly value: T

  /**
   * Returns a definition reference for given configuration object path,
   * or `undefined` if the path is not supported.
   *
   * @param path Object path parts.
   */
  getDefinition(path: string[]): Reference | undefined
}
