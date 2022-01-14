import { readFileSync } from 'fs'
import type { Loader, Reference } from '../loader.js'
import { JsonFileLoaderError } from './jsonFileLoaderError.js'

export class JsonFileLoader<T = unknown> implements Loader<T> {
  constructor(
    private readonly filename: string,
  ) {
  }

  load(): T {
    try {
      const json = readFileSync(this.filename, 'utf-8')
      const value = JSON.parse(json) as T

      return value
    } catch (ex) {
      throw new JsonFileLoaderError(this.filename, ex)
    }
  }

  referenceFor(path: string): Reference | undefined {
    return {
      identifier: path,
      container:  this.filename,
    }
  }
}
