/**
 * Loads and process the configuration.
 * Decorates eventual errors with references to the causing value.
 */
export interface Resolver<T = unknown> {
  /**
   * Loads and processes the configuration.
   * Returns final configuration object.
   */
  resolve(): T
}
