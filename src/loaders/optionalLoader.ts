import type { Loader, Reference } from './loader.js'

export class OptionalLoader<T> implements Loader<T | undefined> {
  constructor(
    private readonly loader: Loader<T>
  ) {
  }

  load(): T | undefined {
    try {
      return this.loader.load()
    } catch {
      // ignore
    }
  }

  referenceFor(path: string): Reference | undefined {
    return this.loader.referenceFor(path)
  }
}
