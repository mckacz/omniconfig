import _ from 'lodash'
import { BaseKeyMapper, CommonKeyMapperOptions } from './baseKeyMapper'
import { Definitions } from '../../../interfaces/definitions'

/**
 * Options for DefinitionKeyMapperOptions.
 */
export interface DefinitionsBasedKeyMapperOptions extends CommonKeyMapperOptions {
  /**
   * Definitions use by the the mapper.
   */
  definitions: Definitions

  /**
   * Word separator to be used in env keys.
   */
  wordSeparator?: string
}

/**
 * Key mapper that uses definitions of supported configuration paths.
 */
export class DefinitionsBasedKeyMapper extends BaseKeyMapper {
  /**
   * Mapping of env key to configuration path.
   */
  private keyToPathDictionary: Record<string, string[]> = {}

  /**
   * Mapping of configuration path key to env key.
   */
  private pathKeyToKeyDictionary: Record<string, string> = {}

  /**
   *
   * @private
   */
  private wordSeparator: string

  /**
   * Creates a new instance of DefinitionsBasedKeyMapper.
   */
  constructor(options: Partial<DefinitionsBasedKeyMapperOptions> & Pick<DefinitionsBasedKeyMapperOptions, 'definitions'>) {
    super(options)

    this.wordSeparator = options.wordSeparator ?? '_'

    this.buildDictionaries(options.definitions)
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
  private buildDictionaries(definition: Definitions) {
    for (const entry of definition) {
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
