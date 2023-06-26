import { readFileSync } from 'fs'
import { SyncLoader } from '../syncLoader'
import { YamlFileLoaderError } from './yamlFileLoaderError'
import { BasicDataContainer } from '../../dataContainers/basicDataContainer'
import type { Reference } from '../../interfaces/reference'
import type{ DataContainer } from '../../interfaces/dataContainer'
import { loadDependency } from '../../common/dependencies'

/**
 * Loads configuration from YAML file.
 */
export class YamlFileLoader<T = unknown> extends SyncLoader<T> {
  private readonly jsYaml: typeof import('js-yaml')
  /**
   * Creates a new instance of YAML file loader.
   *
   * @param filename A path to YAML file to load.
   */
  constructor(
    private readonly filename: string,
  ) {
    super()

    this.jsYaml = loadDependency<typeof import('js-yaml')>('js-yaml')
  }

  /**
   * Loads configuration from configured YAML file synchronously.
   */
  loadSync(): DataContainer<T> {
    try {
      const yaml = readFileSync(this.filename, 'utf-8')
      const value = this.jsYaml.load(yaml) as T

      return new BasicDataContainer(this, value)
    } catch (ex) {
      throw new YamlFileLoaderError(this.filename, ex)
    }
  }

  /**
   * Returns a reference for given path.
   *
   * @param path The path to return a reference for.
   */
  getReferences(path: string[]): Reference[] {
    return [{
      identifier: path.join('.'),
      source:     this.filename,
    }]
  }
}
