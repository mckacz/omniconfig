/**
 * Represents configuration option location.
 */
export interface Reference {
  /**
   * Container where the option has been or can be defined.
   * For example:
   *  - a descriptive name ("Environment variables")
   *  - a path to source file ("/path/to/some/file.json")
   */
  container: string

  /**
   * Identifier that represents the option inside the container.
   * For example:
   *  - environment variable name
   *  - command argument name
   *  - JsonPath-like identifier
   */
  identifier?: string
}

/**
 * Configuration loader.
 */
export interface Loader<T> {
  /**
   * Load configuration.
   */
  load(): T

  /**
   * Returns a reference for given configuration object path,
   * or `undefined` if the path is not supported.
   *
   * @param path Path in the same form that Lodash's `get` accepts.
   */
  referenceFor(path: string): Reference | undefined
}

