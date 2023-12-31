import { OmniConfigError } from '../common/omniConfigError'
import { ValidationError, ValidationErrorType } from '../model/validationError'
import type { Reference } from '../dataContainers/reference'
import type { Loader } from '../loaders/loader'
import type { Model } from '../model/model'

/**
 * Resolver error.
 */
export class ResolverError extends OmniConfigError {
  /**
   * Create a new instance of resolver error.
   *
   * @param err Original error.
   * @param reporter Reporter of the error - either a loader or validator instance.
   * @param path Object path of value that caused the error (if available).
   * @param references Reference to value that caused the error (for invalid value error)
   *                   or list of references where value can be defined (for undefined value error).
   */
  constructor(
    err: Error | unknown,
    readonly reporter?: Loader<unknown> | Model<unknown>,
    readonly path?: string[],
    readonly references: Reference[] = [],
  ) {
    super(
      err instanceof Error ? err.message : `Configuration resolve error: ${String(err)}`,
      err,
    )
  }

  /**
   * True if it holds undefined value error.
   */
  get isUndefinedError() {
    return this.error instanceof ValidationError
      && this.error.type === ValidationErrorType.undefinedValue
  }
}
