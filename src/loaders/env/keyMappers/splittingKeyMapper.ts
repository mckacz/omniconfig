import type { EnvKeyMapper } from './envKeyMapper.js'

/**
 * Options for SplittingKeyMapper.
 */
export interface SplittingKeyMapperOptions {
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
 * Default options for SplittingKeyMapper.
 */
const defaultOptions: SplittingKeyMapperOptions = {
  prefix:    '',
  separator: '__',
}

/**
 * Maps environment variable names by splitting them using provided separator.
 */
export abstract class SplittingKeyMapper implements EnvKeyMapper {
  /**
   * Environment variable name prefix.
   */
  protected readonly prefix: string

  /**
   * Level separator to Environment variable name will be splitted using.
   */
  protected readonly separator: string

  /**
   * Create a new instance of SplittingKeyMapper.
   *
   * @param options Instance options.
   */
   constructor(options?: Partial<SplittingKeyMapperOptions>) {
    this.prefix = options?.prefix ?? defaultOptions.prefix
    this.separator = options?.separator ?? defaultOptions.separator
  }

  /**
   * Maps environment variable name to object path.
   * May return `undefined` if provided environment variable name does not start with configured prefix.
   *
   * @param key Environment variable name.
   */
  keyToPath(key: string): string | undefined {
    if (!key.startsWith(this.prefix)) {
      return
    }

    return key.substring(this.prefix.length)
      .split(this.separator)
      .map(part => this.keyToPathPart(part))
      .join('.')
  }

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  pathToKey(path: string): string {
    const key = path.split('.')
      .map(part => this.pathToKeyPart(part))
      .join(this.separator)

    return this.prefix + key
  }

  /**
   * Maps environment variable name part to object path part.
   *
   * @param keyPart Environment variable name part.
   */
  protected abstract keyToPathPart(keyPart: string): string

  /**
   * Maps object path part to environment variable name part.
   *
   * @param pathPart Object path part.
   */
  protected abstract pathToKeyPart(pathPart: string): string
}
