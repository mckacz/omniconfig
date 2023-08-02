/**
 * Loads and validates the configuration.
 * Decorates eventual errors with references to the causing value.
 */
export interface Resolver<T = unknown> {
  /**
   * Loads and validates the configuration.
   * Returns final configuration object.
   */
  resolve(): T
}
