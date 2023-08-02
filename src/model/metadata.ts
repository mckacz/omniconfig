/**
 * Type of value the configuration entry supports.
 */
export enum ValueType {
  Mixed = 'mixed',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
}

/**
 * Metadata of a single configuration entry.
 */
export interface Metadata {
  /**
   * Configuration entry path.
   */
  path: string[]

  /**
   * Value type.
   */
  type?: ValueType

  /**
   * Flag is the value is required.
   */
  required?: boolean

  /**
   * Flag if the value is an array.
   */
  array?: boolean

  /**
   * Description of the configuration entry.
   */
  description?: string

  /**
   * Default value.
   */
  defaultValue?: unknown
}
