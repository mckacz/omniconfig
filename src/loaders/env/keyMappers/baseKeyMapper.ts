import { EnvKeyMapper } from './envKeyMapper'

/**
 * Options for SplittingKeyMapper.
 */
export interface CommonKeyMapperOptions {
  /**
   * Environment variable name prefix.
   */
  prefix: string

  /**
   * Level separator to Environment variable name will be splitted using.
   */
  separator: string
}

/**
 * Default options for key mappers.
 */
export const defaultKeyMapperOptions: CommonKeyMapperOptions = {
  prefix:    '',
  separator: '__',
}

/**
 * Base class for key mappers.
 */
export abstract class BaseKeyMapper implements EnvKeyMapper {
  /**
   * Environment variable name prefix.
   */
  protected readonly prefix: string

  /**
   * Level separator to Environment variable name will be joined using.
   */
  protected readonly separator: string

  /**
   * Create a new instance of BaseKeyMapper.
   *
   * @param options Instance options.
   */
  constructor(options?: Partial<CommonKeyMapperOptions>) {
    this.prefix = options?.prefix ?? defaultKeyMapperOptions.prefix
    this.separator = options?.separator ?? defaultKeyMapperOptions.separator
  }

  /**
   * Maps environment variable name to object path.
   * May return `undefined` if provided environment variable name is not supported.
   *
   * @param key Environment variable name.
   */
  abstract keyToPath(key: string): string[] | undefined

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  abstract pathToKey(path: string[]): string | undefined
}
