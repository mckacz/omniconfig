import callsites from 'callsites'
import type { Loader, Reference } from './loader.js'

export class ValueLoader<T> implements Loader<T> {
  constructor(
    private readonly value: T,
    private readonly container = ValueLoader.getContainer(),
  ) {
  }

  load(): T {
    return this.value
  }

  referenceFor(path: string): Reference | undefined {
    if (this.container) {
      return {
        identifier: path,
        container:  this.container,
      }
    }
  }

  private static getContainer() {
    try {
      const callSite = callsites()[2]

      if (callSite) {
        const file = callSite.getFileName()
        const line = callSite.getLineNumber()

        if (file) {
          return file + (line ? `:${line}` : '')
        }
      }
    } catch { }
  }
}
