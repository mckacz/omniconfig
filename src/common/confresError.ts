/**
 * Base class for all errors thrown by this library.
 */
export class ConfresError extends Error {
  constructor(
    message: string,
    readonly error?: Error | unknown
  ) {
    super(message)
  }
}
