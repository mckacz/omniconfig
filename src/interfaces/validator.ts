/**
 * Validates loaded configuration.
 */
export interface Validator<T, U> {
  /**
   * Validates the data asynchronously.
   *
   * @param data Data to validate.
   */
  validate(data: T): Promise<U>

  /**
   * Validates the data synchronously.
   *
   * @param data Data to validate.
   */
  validateSync?(data: T): U
}
