import { readFileSync } from 'fs'
import _ from 'lodash'
import { BasicDataContainer } from '../../dataContainers/basicDataContainer'
import { SyncLoader } from '../syncLoader'
import { FileLoaderError } from './fileLoaderError'
import type { Reference } from '../../dataContainers/reference'

/**
 * Loads configuration from a file.
 */
export abstract class FileLoader<T> extends SyncLoader<T> {

  /**
   * Section of file to load.
   */
  protected readonly section?: string | string[]

  /**
   * Creates a new instance of a file loader.
   *
   * @param filename File path to load.
   * @param section  Section of file to load.
   */
  constructor(
    protected readonly filename: string,
    section?: string | string[],
  ) {
    super()

    if (section && typeof section === 'string') {
      section = section.split('.')
    }

    this.section = section
  }

  /**
   * Loads configuration from configured file synchronously.
   */
  loadSync(): BasicDataContainer<T> {
    try {
      const data = readFileSync(this.filename, 'utf-8')
      let value  = this.parse(data)

      if (this.section?.length) {
        value = _.get(value, this.section)
      }

      return new BasicDataContainer(this, value as T)
    } catch (ex) {
      throw new FileLoaderError(this.filename, ex)
    }
  }

  /**
   * Returns a reference for given path.
   *
   * @param path The path to return a reference for.
   */
  getReferences(path: string[]): Reference[] {
    return [
      {
        identifier: [...this.section ?? [], ...path].join('.'),
        source:     this.filename,
      },
    ]
  }

  /**
   * Parse file content into object.
   *
   * @param data Data to parse
   */
  protected abstract parse(data: string): unknown
}
