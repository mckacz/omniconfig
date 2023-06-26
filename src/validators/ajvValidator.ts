import type { AnySchemaObject, AnyValidateFunction, DataValidationCxt } from 'ajv/dist/types'
import type { ErrorObject, ValidationError as AjvValidationError } from 'ajv'
import { Validator } from '../interfaces/validator'
import { ValidationError, ValidationErrorType } from './validationError'
import { loadDependency } from '../common/dependencies'

/**
 * Validates loaded configuration against JSON Schema / JDT Schema.
 */
export class AjvValidator<T> implements Validator<unknown, T> {
  /**
   * Ajv validation function.
   */
  private readonly fn: AnyValidateFunction<T>

  /**
   * Creates a new instance of the validator.
   *
   * @param fnOrSchema Compiled Ajv validation function or JSON schema.
   * @param context Context for validation function.
   */
  constructor(
    fnOrSchema: AnyValidateFunction<T> | AnySchemaObject,
    private readonly context?: DataValidationCxt,
  ) {
    if (typeof fnOrSchema === 'function') {
      this.fn = fnOrSchema
    } else {
      this.fn = this.compile(fnOrSchema)
    }
  }

  /**
   * Validates the data asynchronously.
   *
   * @param data Data to validate.
   */
  async validate(data: unknown): Promise<T> {
    if (!('$async' in this.fn)) {
      return this.validateSync(data)
    }

    try {
      return await this.fn(data, this.context)
    } catch (ex) {
      if (this.isAjvValidationError(ex)) {
        throw this.createValidationError(ex.errors, ex)
      }

      throw new ValidationError(`Validation error: ${String(ex)}`, ex)
    }
  }

  /**
   * Validates the data synchronously.
   *
   * @param data Data to validate.
   */
  validateSync(data: unknown): T {
    if ('$async' in this.fn) {
      throw new ValidationError('Validation function is asynchronous')
    }

    if (!this.fn(data, this.context)) {
      throw this.createValidationError(this.fn.errors)
    }

    return data
  }

  /**
   * Wraps Ajv errors into ValidationError.
   *
   * @param errors Ajv error objects.
   * @param ex Original error
   */
  private createValidationError(errors?: Partial<ErrorObject>[] | null, ex?: Error) {
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

  /**
   * Compiles JSON schema using default option.
   *
   * @param schema JSON schema to compile.
   */
  private compile(schema: AnySchemaObject): AnyValidateFunction {
    const Ajv = loadDependency<typeof import('ajv')>('ajv').default

    const ajv = new Ajv({
      coerceTypes:      true,
      useDefaults:      true,
      removeAdditional: true
    })

    return ajv.compile(schema)
  }
}
