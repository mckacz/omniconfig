import { ResolverError } from './resolverError'
import { ValidationError, ValidationErrorType } from '../validators/validationError'
import type { Loader } from '../interfaces/loader'
import type { Validator } from '../interfaces/validator'
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
   * @param validator Validator to be used to validate the configuration.
   */
  constructor(
    protected readonly loaders: Loader<unknown | undefined>[],
    protected readonly validator?: Validator<unknown, Type>,
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
   * @param validator Validator instance that reported the error.
   */
  protected decorateError(
    err: ValidationError | unknown,
    dataContainer: DataContainer<unknown>,
    validator: Validator<unknown, unknown>
  ) {
    if (!(err instanceof ValidationError) || !err.path) {
      return new ResolverError(err, validator)
    }

    if (err.type === ValidationErrorType.undefinedValue) {
      return new ResolverError(
        err,
        validator,
        err.path,
        this.resolveReferencesForUndefinedValue(err.path),
      )
    }

    const reference = dataContainer.getDefinition(err.path)

    return new ResolverError(
      err,
      validator,
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
