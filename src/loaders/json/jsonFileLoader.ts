import { readFileSync } from 'fs'
import type { Loader, Reference } from '../loader.js'
import { JsonFileLoaderError } from './jsonFileLoaderError.js'

/**
 * Loads configuration from JSON file.
 */
export class JsonFileLoader<T = unknown> implements Loader<T> {
  /**
   * Creates a new instance of JSON file loader.
   *
   * @param filename A path to JSON file to load.
   */
  constructor(
    private readonly filename: string,
  ) {
  }

  /**
   * Loads configuration from configured JSON file.
   */
  load(): T {
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
