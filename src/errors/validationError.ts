import { ConfresError } from './confresError'

/**
 * Validation error type.
 */
export enum ValidationErrorType {
  /** Generic error */
  generic,

  /** Invalid value error */
  invalidValue,

  /** Undefined value error */
  undefinedValue,
}

/**
 * Represents a validation error.
 */
export class ValidationError extends ConfresError {
  /**
   * Creates a new instance of validation error.
   *
   * @param message Error message
   * @param innerError Inner error if available.
   * @param path Object path that caused the error if available.
   * @param type Type of validation error.
   */
  constructor(
    message: string,
    innerError?: Error | unknown,
    readonly path?: string[],
    readonly type = ValidationErrorType.generic,
  ) {
    super(message, innerError)
  }
}
