import callsites from 'callsites'
import { BasicDataContainer } from '../dataContainers/basicDataContainer'
import { SyncLoader } from './syncLoader'
import type { DataContainer } from '../interfaces/dataContainer'
import type { Reference } from '../interfaces/reference'

/**
 * Loader that loads an arbitrary static value.
 */
export class ValueLoader<T> extends SyncLoader<T> {
  /**
   * Creates a new instance of ValueLoader.

   * @param value The value to return as a load result.
   * @param source Value source name.
   */
  constructor(
    private readonly value: T,
    private readonly source = ValueLoader.getSource(),
  ) {
    super()
  }

  /**
   * Loads the value synchronously.
   */
  loadSync(): DataContainer<T> {
    return new BasicDataContainer(this, this.value)
  }

  /**
   * Returns supported source references for given configuration object path.
   *
   * @param path Object path parts.
   */
  getReferences(path: string[]): Reference[] {
    if (this.source) {
      return [{
        identifier: path.join('.'),
        source:     this.source,
      }]
    }

    return []
  }

  /**
   * Attempts to determine the source name from the call stack.
   */
  private static getSource() {
    // 1st frame is this method
    // 2nd frame is the constructor of this class
    // 3rd frame is the target
    const callSite = callsites()[2]

    if (callSite) {
      const file = callSite.getFileName()
      const line = callSite.getLineNumber()

      if (file) {
        return file + (line ? `:${line}` : '')
      }
    }
  }
}
