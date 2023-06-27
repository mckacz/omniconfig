import _ from 'lodash'
import { BaseKeyMapper, CommonKeyMapperOptions } from './baseKeyMapper'
import { Metadata } from '../../../interfaces/metadata'

/**
 * Options for MetadataBasedKeyMapper.
 */
export interface MetadataBasedKeyMapperOptions extends CommonKeyMapperOptions {
  /**
   * Definitions use by the the mapper.
   */
  metadata: Metadata[]

  /**
   * Word separator to be used in env keys.
   */
  wordSeparator?: string
}

/**
 * Key mapper that uses metadata of supported configuration paths.
 */
export class MetadataBasedKeyMapper extends BaseKeyMapper {
  /**
   * Mapping of env key to configuration path.
   */
  private keyToPathDictionary: Record<string, string[]> = {}

  /**
   * Mapping of configuration path key to env key.
   */
  private pathKeyToKeyDictionary: Record<string, string> = {}

  /**
   * Word separator to be used in env keys.
   */
  private wordSeparator: string

  /**
   * Creates a new instance of MetadataBasedKeyMapper.
   */
  constructor(options: Partial<MetadataBasedKeyMapperOptions> & Pick<MetadataBasedKeyMapperOptions, 'metadata'>) {
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
  keyToPath(key: string): string[] | undefined {
    return this.keyToPathDictionary[key]
  }

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  pathToKey(path: string[]): string {
    return this.pathKeyToKeyDictionary[this.getPathDictionaryKey(path)]
  }

  /**
   * Builds dictionaries used by this mapper.
   */
  private buildDictionaries(metadata: Metadata[]) {
    for (const entry of metadata) {
      const key = this.getPathKey(entry.path)
      const dictKey = this.getPathDictionaryKey(entry.path)

      this.keyToPathDictionary[key] = entry.path
      this.pathKeyToKeyDictionary[dictKey] = key
    }
  }

  /**
   * Creates a configuration path key used internally by the mapping dictionary.
   */
  private getPathDictionaryKey(path: string[]): string {
    return path.join('+')
  }

  /**
   * Creates env key from given configuration path.
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
