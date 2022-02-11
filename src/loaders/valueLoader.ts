import callsites from 'callsites'
import type { Loader, Reference } from './loader'

/**
 * Loader that loads an arbitrary static value.
 */
export class ValueLoader<T> implements Loader<T> {
  /**
   * Creates a new instance of ValueLoader.

   * @param value The value to return as a load result.
   * @param container Value container name.
   */
  constructor(
    private readonly value: T,
    private readonly container = ValueLoader.getContainer(),
  ) {
  }

  /**
   * Loads the value.
   */
  load(): T {
    return this.value
  }

  /**
   * Returns reference for given path if the container
   * has been passed to the constructor (or has been automatically detected).
   *
   * @param path The path to return a reference for.
   */
  referenceFor(path: string): Reference | undefined {
    if (this.container) {
      return {
        identifier: path,
        container:  this.container,
      }
    }
  }

  /**
   * Attempts to determine the container name from the call stack.
   */
  private static getContainer() {
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
