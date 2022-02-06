import _ from 'lodash'
import type { Loader, Reference } from '../loaders/loader.js'
import type { Processor } from '../processors/processor.js'
import { ResolverError } from './resolverError.js'
import { ProcessorError, ProcessorErrorType } from '../processors/processorError.js'

/**
 * Loads and process the configuration.
 * Decorates eventual errors with references to the causing value.
 */
export class Resolver<T = unknown> {
  /**
   * Create a new instance of resolver.
   *
   * @param loaders List of loaders to use. Configuration acquired from the loaders
   *                will be merged in order from left to right.
   *
   * @param processors List of processors to be applied on loaded configuration object.
   */
  constructor(
    private readonly loaders: Loader<unknown | undefined>[],
    private readonly processors: Processor<unknown, T>[] = [],
  ) {
  }

  /**
   * Loads and processes the configuration.
   * Returns final configuration object.
   */
  resolve(): T {
    const sources = this.load()
    const resolved = this.process(sources)

    return resolved
  }

  /**
   * Loads configurations using loaders.
   */
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

  /**
   * Merges and processes the configurations using processors.
   *
   * @param sources Source configuration objects.
   */
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

  /**
   * Decorates processing error with references to the causing value if available.
   *
   * @param err Error object.
   * @param sources Source configuration objects.
   * @param processor Processor instance that reported the error.
   */
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

  /**
   * Tries to find a loader that has loaded a value for given object path.
   *
   * @param path Object path.
   * @param sources Source configuration objects.
   */
  private findLoaderOfPath(path: string, sources: unknown[]): Loader<unknown> | undefined {
    const sourceIndex = _.findLastIndex(sources, sourceValue => _.get(sourceValue, path) !== undefined)

    if (sourceIndex !== -1) {
      return this.loaders[sourceIndex]
    }
  }

  /**
   * Resolves a list of references where the undefined value can be defined.
   *
   * @param path Object path.
   */
  private resolveReferencesForUndefinedValue(path: string): Reference[] {
    return this.removeEmptyReferences(
      this.loaders.map(
        loader => loader.referenceFor(path)
      )
    )
  }

  /**
   * Removes empty references from the list.
   *
   * @param references List of references.
   */
  private removeEmptyReferences(references: Array<Reference | undefined>): Reference[] {
    return references.filter(ref => ref !== undefined) as Reference[]
  }
}
