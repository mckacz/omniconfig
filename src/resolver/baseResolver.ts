import { ResolverError } from './resolverError'
import { ProcessorError, ProcessorErrorType } from '../processors/processorError'
import type { Loader } from '../interfaces/loader'
import type { Processor } from '../interfaces/processor'
import type { Resolver } from '../interfaces/resolver'
import type { Reference } from '../interfaces/reference'
import type { DataContainer } from '../interfaces/dataContainer'

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
   * @param dataContainer Source configuration objects.
   * @param processor Processor instance that reported the error.
   */
  protected decorateError(err: ProcessorError | unknown, dataContainer: DataContainer<unknown>, processor: Processor<unknown, unknown>) {
    if (!(err instanceof ProcessorError) || !err.path) {
      return new ResolverError(err, processor)
    }

    if (err.type === ProcessorErrorType.undefinedValue) {
      return new ResolverError(
        err,
        processor,
        err.path,
        this.resolveReferencesForUndefinedValue(err.path),
      )
    }

    const reference = dataContainer.getDefinition(err.path)

    return new ResolverError(
      err,
      processor,
      err.path,
      reference ? [reference] : [],
    )
  }

  /**
   * Resolves a list of references where the undefined value can be defined.
   *
   * @param path Object path.
   */
  private resolveReferencesForUndefinedValue(path: string[]): Reference[] {
    const references: Reference[] = []

    for (const loader of this.loaders) {
      references.push(...loader.getReferences(path))
    }

    return references
  }
}
