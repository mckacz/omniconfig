export interface Reference {
  container: string
  identifier?: string
}

export interface Loader<T> {
  load(): T
  referenceFor(path: string): Reference | undefined
}

