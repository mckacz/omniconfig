import callsites from 'callsites'
import { BasicDataContainer } from '../dataContainers/basicDataContainer'
import { SyncLoader } from './syncLoader'
import type { Reference } from '../dataContainers/reference'

/**
 * Loader that loads an arbitrary static value.
 */
export class ValueLoader<T> extends SyncLoader<T> {
  private readonly source?: string

  /**
   * Creates a new instance of ValueLoader.

   * @param value The value to return as a load result.
   * @param sourceOrFrameIndex Value source name or stack trace index to use
   *                           (0 - direct caller; 1 - caller of the caller, etc)
   */
  constructor(
    private readonly value: T,
    sourceOrFrameIndex: number | string = 0,
  ) {
    super()

    this.source = typeof sourceOrFrameIndex === 'string'
      ? sourceOrFrameIndex
      : ValueLoader.getSource(sourceOrFrameIndex)
  }

  /**
   * Loads the value synchronously.
   */
  loadSync(): BasicDataContainer<T> {
    return new BasicDataContainer(this, this.value)
  }

  /**
   * Returns supported source references for given configuration object path.
   *
   * @param path Object path parts.
   */
  getReferences(path: string[]): Reference[] {
    if (this.source) {
      return [
        {
          identifier: path.join('.'),
          source:     this.source,
        },
      ]
    }

    return []
  }

  /**
   * Attempts to determine the source name from the call stack.
   */
  private static getSource(skipFrames: number) {
    // 1st frame is this method
    // 2nd frame is the constructor of this class
    // 3rd frame is the direct caller
    const callSite = callsites()[2 + skipFrames]

    if (callSite) {
      const file = callSite.getFileName()
      const line = callSite.getLineNumber()

      if (file) {
        return file + (line ? `:${line}` : '')
      }
    }
  }
}
