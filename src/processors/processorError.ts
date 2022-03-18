import { ConfresError } from '../common/confresError'

/**
 * Processing error type.
 */
export enum ProcessorErrorType {
  /** Generic error */
  generic,

  /** Invalid value error */
  invalidValue,

  /** Undefined value error */
  undefinedValue,
}

/**
 * Represents a processing error.
 */
export class ProcessorError extends ConfresError {
  /**
   * Creates a new instance of processing error.
   *
   * @param message Error message
   * @param innerError Inner error if available.
   * @param path Object path that caused the error if available.
   * @param type Type of processing error.
   */
  constructor(
    message: string,
    innerError?: Error | unknown,
    readonly path?: string,
    readonly type = ProcessorErrorType.generic,
  ) {
    super(message, innerError)
  }
}
