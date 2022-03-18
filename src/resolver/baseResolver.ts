import _ from 'lodash'
import type { Loader} from '../interfaces/loader'
import type { Processor } from '../interfaces/processor'
import { ProcessorError, ProcessorErrorType } from '../processors/processorError'
import { ResolverError } from './resolverError'
import { Resolver } from '../interfaces/resolver'
import type { Reference } from '../interfaces/reference'

/**
 * Common parts of AsyncResolver and SyncResolver.
 */
export abstract class BaseResolver<Type, ReturnType = Type> implements Resolver<ReturnType> {
  /**
   * Create a new instance of resolver.
   *
   * @param loaders List of loaders to use. Configuration acquired from the loaders
   *                will be merged in order from left to right.
   *
   * @param processors List of processors to be applied on loaded configuration object.
   */
  constructor(
    protected readonly loaders: Loader<unknown | undefined>[],
    protected readonly processors: Processor<unknown, Type>[] = [],
  ) {
  }

  /**
   * Loads and processes the configuration.
   * Returns final configuration object.
   */
  abstract resolve(): ReturnType

  /**
   * Decorates processing error with references to the causing value if available.
   *
   * @param err Error object.
   * @param sources Source configuration objects.
   * @param processor Processor instance that reported the error.
   */
  protected decorateError(err: ProcessorError | unknown, sources: unknown[], processor: Processor<unknown, unknown>) {
    if (!(err instanceof ProcessorError) || !err.path) {
      return new ResolverError(err, processor)
    }

    if (err.type === ProcessorErrorType.undefinedValue) {
      return new ResolverError(
        err,
        processor,
        undefined,
        err.path,
        this.resolveReferencesForUndefinedValue(err.path),
      )
    }

    const loader = this.findLoaderOfPath(err.path, sources)

    return new ResolverError(
      err,
      processor,
      loader,
      err.path,
      this.removeEmptyReferences([loader?.referenceFor(err.path)]),
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
        loader => loader.referenceFor(path),
      ),
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
