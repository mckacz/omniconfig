import _ from 'lodash'
import type { Loader, Reference } from '../loaders/loader.js'
import type { Processor } from '../processors/processor.js'
import { ResolverError } from './resolverError.js'
import { ProcessorError, ProcessorErrorType } from '../processors/processorError.js'

export class Resolver<T = unknown> {
  constructor(
    private readonly loaders: Loader<unknown | undefined>[],
    private readonly processors: Processor<unknown, T>[] = [],
  ) {
  }

  resolve(): T {
    const sources = this.load()
    const resolved = this.process(sources)

    return resolved
  }

  private load() {
    const sources: unknown[] = []

    for (const loader of this.loaders) {
      try {
        sources.push(loader.load())
      } catch (ex) {
        throw new ResolverError(ex, loader)
      }
    }
    return sources
  }

  private process(sources: unknown[]) {
    let merged = _.merge({}, ...sources) as T

    for (const processor of this.processors) {
      try {
        merged = processor.process(merged)
      } catch (ex) {
        throw this.decorateError(ex, sources, processor)
      }
    }
    return merged
  }

  private decorateError(err: ProcessorError | unknown, sources: unknown[], processor: Processor<unknown, unknown>) {
    if (!(err instanceof ProcessorError) || !err.path) {
      return new ResolverError(err, processor)
    }

    if (err.type === ProcessorErrorType.undefinedValue) {
      return new ResolverError(
        err,
        processor,
        undefined,
        err.path,
        this.resolveReferencesForUndefinedValue(err.path)
      )
    }

    const loader = this.findLoaderOfPath(err.path, sources)

    return new ResolverError(
      err,
      processor,
      loader,
      err.path,
      this.removeEmptyReferences([loader?.referenceFor(err.path)])
    )
  }

  private findLoaderOfPath(path: string, sources: unknown[]): Loader<unknown> | undefined {
    const sourceIndex = _.findLastIndex(sources, sourceValue => _.get(sourceValue, path) !== undefined)

    if (sourceIndex !== -1) {
      return this.loaders[sourceIndex]
    }
  }

  private resolveReferencesForUndefinedValue(path: string): Reference[] {
    return this.removeEmptyReferences(
      this.loaders.map(
        loader => loader.referenceFor(path)
      )
    )
  }

  private removeEmptyReferences(references: Array<Reference | undefined>): Reference[] {
    return references.filter(ref => ref !== undefined) as Reference[]
  }
}
