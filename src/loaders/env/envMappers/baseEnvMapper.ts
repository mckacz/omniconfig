import { EnvMapper } from './envMapper'

/**
 * Options for BaseEnvKeyMapper.
 */
export interface CommonEnvMapperOptions {
  /**
   * Environment variable name prefix.
   */
  prefix: string

  /**
   * Level separator to Environment variable name will be split using.
   */
  separator: string
}

/**
 * Default options for env mappers.
 */
export const defaultEnvMapperOptions: CommonEnvMapperOptions = {
  prefix:    '',
  separator: '__',
}

/**
 * Base class for env mappers.
 */
export abstract class BaseEnvMapper implements EnvMapper {
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
  constructor(options?: Partial<CommonEnvMapperOptions>) {
    this.prefix = options?.prefix ?? defaultEnvMapperOptions.prefix
    this.separator = options?.separator ?? defaultEnvMapperOptions.separator
  }

  /**
   * Maps environment variable name to object path.
   * May return `undefined` if provided environment variable name is not supported.
   *
   * @param env Environment variable name.
   */
  abstract envToPath(env: string): string[] | undefined

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  abstract pathToEnv(path: string[]): string | undefined
}
