import { readFileSync } from 'fs'
import { BasicDataContainer } from '../../dataContainers/basicDataContainer'
import { SyncLoader } from '../syncLoader'
import { YamlFileLoaderError } from './yamlFileLoaderError'
import type { DataContainer } from '../../dataContainers/dataContainer'
import type { Reference } from '../../dataContainers/reference'

/**
 * Loads configuration from YAML file.
 */
export class YamlFileLoader<T = unknown> extends SyncLoader<T> {
  /**
   * Creates a new instance of YAML file loader.
   *
   * @param filename A path to YAML file to load.
   * @param jsYamlLoad load() function from "js-yaml"
   */
  constructor(
    private readonly filename: string,
    private readonly jsYamlLoad: typeof import('js-yaml')['load']
  ) {
    super()
  }

  /**
   * Loads configuration from configured YAML file synchronously.
   */
  loadSync(): DataContainer<T> {
    try {
      const yaml = readFileSync(this.filename, 'utf-8')
      const value = this.jsYamlLoad(yaml) as T

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
