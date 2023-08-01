import { ValidationError, ValidationErrorType } from '../../errors/validationError'
import type { Model } from '../../interfaces/model'
import type { ErrorObject, ValidationError as AjvValidationError } from 'ajv'
import type { AnyValidateFunction, DataValidationCxt } from 'ajv/dist/types'

/**
 * Model that uses JSON/JDT schema.
 */
export class AjvModel<TData> implements Model<TData> {
  /**
   * Creates a new instance of AjvModel.
   *
   * @param fn Compiled Ajv validation function.
   * @param context Ajv validation context.
   */
  constructor(
    private readonly fn: AnyValidateFunction<TData>,
    private readonly context?: DataValidationCxt
  ) {
  }

  /**
   * Asynchronously validate input against the model.
   * @param input Input to validate.
   */
  async validate(input: unknown): Promise<TData> {
    if (!('$async' in this.fn)) {
      return this.validateSync(input)
    }

    try {
      return await this.fn(input, this.context)
    } catch (ex_1) {
      return Promise.reject(
        this.createValidationError(ex_1)
      )
    }
  }

  /**
   * Synchronously validate input against the model.
   * @param input Input to validate.
   */
  validateSync(input: unknown): TData {
    if ('$async' in this.fn) {
      throw new ValidationError('Validation function is asynchronous')
    }

    if (!this.fn(input, this.context)) {
      throw this.createValidationError(this.fn.errors)
    }

    return input
  }

  /**
   * Creates validation error from Ajv results.
   * @param errorObjectsOrValidationError Ajv
   * @private
   */
  private createValidationError(errorObjectsOrValidationError?: Partial<ErrorObject>[] | unknown): ValidationError {
    let ex: Error | undefined
    let errors: Partial<ErrorObject>[] | undefined

    if (errorObjectsOrValidationError instanceof Array) {
      errors = errorObjectsOrValidationError
    } else if (this.isAjvValidationError(errorObjectsOrValidationError)) {
      ex = errorObjectsOrValidationError
      errors = errorObjectsOrValidationError.errors ?? []
    } else if (ex) {
      return new ValidationError(`Validation error: ${String(ex)}`, ex)
    }

    if (!errors?.length) {
      return new ValidationError('Invalid data', ex, [], ValidationErrorType.invalidValue)
    }

    const error = errors[0]
    const path = error.instancePath?.split('/').filter(p => !!p) ?? []

    if (error.keyword === 'required') {
      return new ValidationError(
        'is required',
        ex,
        [...path, error.params?.missingProperty],
        ValidationErrorType.undefinedValue,
      )
    }

    return new ValidationError(
      error.message ?? ex?.message ?? 'Validation error',
      ex,
      path,
      ValidationErrorType.invalidValue,
    )
  }

  /**
   * Checks if an error is the Ajv Validation Error.
   *
   * @param ex Error instance to check.
   */
  private isAjvValidationError(ex: AjvValidationError | unknown): ex is AjvValidationError {
    return !!ex && !!(ex as AjvValidationError)?.ajv && !!(ex as AjvValidationError)?.validation
  }
}
