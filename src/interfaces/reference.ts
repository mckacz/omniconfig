/**
 * Represents configuration option location.
 */
export interface Reference {
  /**
   * Source that the option has been or can be defined in.
   * For example:
   *  - a descriptive name ("Environment variables")
   *  - a path to file ("/path/to/some/file.json")
   */
  source: string

  /**
   * Identifier that represents the option inside the source.
   * For example:
   *  - environment variable name
   *  - command argument name
   *  - JsonPath-like identifier
   */
  identifier?: string
}
