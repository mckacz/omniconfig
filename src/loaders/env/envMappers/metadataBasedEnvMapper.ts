import _ from 'lodash'
import { Metadata } from '../../../model/metadata'
import { BaseEnvMapper, CommonEnvMapperOptions } from './baseEnvMapper'

/**
 * Options for MetadataBasedKeyMapper.
 */
export interface MetadataBasedEnvMapperOptions extends CommonEnvMapperOptions {
  /**
   * Definitions use by the the mapper.
   */
  metadata: Metadata[]

  /**
   * Word separator to be used in env name.
   */
  wordSeparator?: string
}

/**
 * Env mapper that uses metadata of supported configuration paths.
 */
export class MetadataBasedEnvMapper extends BaseEnvMapper {
  /**
   * Mapping of env name to configuration path.
   */
  private envToPathDictionary: Record<string, string[]> = {}

  /**
   * Mapping of configuration path key to env name.
   */
  private pathKeyToEnvDictionary: Record<string, string> = {}

  /**
   * Word separator to be used in envs.
   */
  private wordSeparator: string

  /**
   * Creates a new instance of MetadataBasedEnvMapper.
   */
  constructor(options: Partial<MetadataBasedEnvMapperOptions> & Pick<MetadataBasedEnvMapperOptions, 'metadata'>) {
    super(options)

    this.wordSeparator = options.wordSeparator ?? '_'

    this.buildDictionaries(options.metadata)
  }

  /**
   * Maps environment variable name to object path.
   * May return `undefined` if provided environment variable name is not supported.
   *
   * @param key Environment variable name.
   */
  envToPath(key: string): string[] | undefined {
    return this.envToPathDictionary[key]
  }

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  pathToEnv(path: string[]): string {
    return this.pathKeyToEnvDictionary[this.getPathDictionaryKey(path)]
  }

  /**
   * Builds dictionaries used by this mapper.
   */
  private buildDictionaries(metadata: Metadata[]) {
    for (const entry of metadata) {
      const key = this.getPathKey(entry.path)
      const dictKey = this.getPathDictionaryKey(entry.path)

      this.envToPathDictionary[key] = entry.path
      this.pathKeyToEnvDictionary[dictKey] = key
    }
  }

  /**
   * Creates a configuration path key used internally by the mapping dictionary.
   */
  private getPathDictionaryKey(path: string[]): string {
    return path.join('+')
  }

  /**
   * Creates env name from given configuration path.
   */
  private getPathKey(path: string[]): string {
    const key = path
      .map(part =>
        _.snakeCase(part)
          .split('_')
          .join(this.wordSeparator)
          .toUpperCase()
      )
      .join(this.separator)

    return this.prefix + key
  }
}
