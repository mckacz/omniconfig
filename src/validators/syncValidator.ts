import { Validator } from '../interfaces/validator'

/**
 * Base class for synchronous-only validators.
 * Implements asynchronous mode by wrapping synchronous call in a Promise.
 */
export abstract class SyncValidator<T, U> implements Validator<T, U> {
  /**
   * Validates the data synchronously.
   *
   * @param payload Data to validate.
   */
  abstract validateSync(payload: T): U

  /**
   * Validates the data asynchronously.
   *
   * @param payload Data to validate.
   */
  validate(payload: T): Promise<U> {
    return new Promise<U>((resolve, reject) => {
      try {
        resolve(this.validateSync(payload))
      } catch (ex) {
        reject(ex)
      }
    })
  }
}
