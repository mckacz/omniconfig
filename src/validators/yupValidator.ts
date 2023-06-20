import type { Asserts, ObjectSchema, ValidateOptions, ValidationError as YupValidationError } from 'yup'
import { ValidationError, ValidationErrorType } from './validationError'
import { SyncValidator } from './syncValidator'

/**
 * Default validate options for yup.
 */
const defaultValidateOptions: ValidateOptions = { stripUnknown: true }

/**
 * Casts and validates the configuration object using yup schema.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class YupValidator<Schema extends ObjectSchema<any>> extends SyncValidator<unknown, Asserts<Schema>>{
  /**
   * Creates a new instance of the validator.
   *
   * @param schema Yup schema to check the configuration against.
   * @param validateOptions Options passed to `schema.validate()`
   */
  constructor(
    private readonly schema: Schema,
    private readonly validateOptions = defaultValidateOptions,
  ) {
    super()
  }

  /**
   * Validates the configuration object asynchronously.
   *
   * @param payload Data to validate.
   */
  validateSync(payload: unknown): Asserts<Schema> {
    try {

      // Return type is determined from passed schema.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.schema.validateSync(payload, this.validateOptions)

    } catch (ex) {
      if (YupValidator.isYupValidationError(ex)) {
        throw new ValidationError(
          ex.message,
          ex,
          ex.path?.split('.') ?? [],
          ex.type === 'optionality'
            ? ValidationErrorType.undefinedValue
            : ValidationErrorType.invalidValue,
        )
      }

      throw new ValidationError(`Validation error: ${String(ex)}`, ex)
    }
  }

  /**
   * Check if it is a yup validation error instance.
   *
   * @param err Error instance to check.
   */
  private static isYupValidationError(err: YupValidationError | unknown): err is YupValidationError {
    return err instanceof Error
      && 'path' in err
      && 'type' in err
  }
}
