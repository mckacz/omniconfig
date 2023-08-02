import { ValidationError, ValidationErrorType } from '../model/validationError'
import { ResolverError } from './resolverError'
import type { Resolver } from './resolver'
import type { DataContainer } from '../dataContainers/dataContainer'
import type { Reference } from '../dataContainers/reference'
import type { Loader } from '../loaders/loader'
import type { Model } from '../model/model'

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
   * @param model Model to be used to validate the configuration.
   */
  constructor(
    protected readonly loaders: Loader<unknown | undefined>[],
    protected readonly model?: Model<ReturnType>,
  ) {
  }

  /**
   * Loads and validates the configuration.
   * Returns final configuration object.
   */
  abstract resolve(): ReturnType

  /**
   * Decorates validation error with references to the causing value if available.
   *
   * @param err Error object.
   * @param dataContainer Source configuration objects.
   */
  protected decorateError(
    err: ValidationError | unknown,
    dataContainer: DataContainer<unknown>
  ) {
    if (!(err instanceof ValidationError) || !err.path) {
      return new ResolverError(err, this.model)
    }

    if (err.type === ValidationErrorType.undefinedValue) {
      return new ResolverError(
        err,
        this.model,
        err.path,
        this.resolveReferencesForUndefinedValue(err.path),
      )
    }

    const reference = dataContainer.getDefinition(err.path)

    return new ResolverError(
      err,
      this.model,
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
