import { readFileSync } from 'fs'
import type { Reference } from '../loader'
import { SyncLoader } from '../syncLoader'
import { JsonFileLoaderError } from './jsonFileLoaderError'

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
  loadSync(): T {
    try {
      const json = readFileSync(this.filename, 'utf-8')
      const value = JSON.parse(json) as T

      return value
    } catch (ex) {
      throw new JsonFileLoaderError(this.filename, ex)
    }
  }

  /**
   * Returns a reference for given path.
   *
   * @param path The path to return a reference for.
   */
  referenceFor(path: string): Reference | undefined {
    return {
      identifier: path,
      container:  this.filename,
    }
  }
}
