import { readFileSync } from 'fs'
import { SyncLoader } from '../syncLoader'
import { JsonFileLoaderError } from './jsonFileLoaderError'
import { BasicDataContainer } from '../../common/basicDataContainer'
import type { Reference } from '../../interfaces/reference'
import type{ DataContainer } from '../../interfaces/dataContainer'

/**
 * Loads configuration from JSON file.
 */
export class JsonFileLoader<T = unknown> extends SyncLoader<T> {
  /**
   * Creates a new instance of JSON file loader.
   *
   * @param filename A path to JSON file to load.
   */
  constructor(
    private readonly filename: string,
  ) {
    super()
  }

  /**
   * Loads configuration from configured JSON file synchronously.
   */
  loadSync(): DataContainer<T> {
    try {
      const json = readFileSync(this.filename, 'utf-8')
      const value = JSON.parse(json) as T

      return new BasicDataContainer(this, value)
    } catch (ex) {
      throw new JsonFileLoaderError(this.filename, ex)
    }
  }

  /**
   * Returns a reference for given path.
   *
   * @param path The path to return a reference for.
   */
  referencesFor(path: string): Reference[] {
    return [{
      identifier: path,
      source:     this.filename,
    }]
  }
}
