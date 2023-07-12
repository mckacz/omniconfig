import { ValidationError, ValidationErrorType } from '../../errors/validationError'
import { Metadata } from '../../interfaces/metadata'
import { Model } from '../../interfaces/model'
import { buildMetadata } from './metadata'
import type { Asserts, ObjectSchema, ValidateOptions, ValidationError as YupValidationError } from 'yup'

/**
 * Yup schema-based configuration model.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class YupModel<TSchema extends ObjectSchema<any>, TData = Asserts<TSchema>> implements Model<TData> {
  /**
   * Default validate options for Yup.
   */
  static readonly defaultValidateOptions: ValidateOptions = {
    stripUnknown: true,
  }

  /**
   * Configuration metadata.
   */
  private metadata?: Metadata[]

  /**
   * Creates a new instance of YupModel.
   *
   * @param schema Yup object schema to use.
   * @param validateOptions Yup validate options.
   */
  constructor(
    private readonly schema: TSchema,
    private readonly validateOptions = YupModel.defaultValidateOptions,
  ) {
  }

  /**
   * Get model metadata.
   */
  getMetadata(): Metadata[] {
    if (!this.metadata) {
      this.metadata = buildMetadata(this.schema)
    }

    return this.metadata
  }

  /**
   * Asynchronously validate input against the model.
   * @param input Input to validate.
   */
  validate(input: unknown): Promise<TData> {
    return this.schema.validate(input, this.validateOptions)
      .catch(ex => Promise.reject(this.decorateError(ex)))
  }

  /**
   * Synchronously validate input against the model.
   * @param input Input to validate.
   */
  validateSync(input: unknown): TData {
    try {
      return this.schema.validateSync(input, this.validateOptions) as TData
    } catch (ex) {
      throw this.decorateError(ex)
    }
  }

  /**
   * Decorate Yup error
   * @param ex Error to decorate
   */
  private decorateError(ex: unknown): ValidationError {
    if (this.isYupValidationError(ex)) {
      return new ValidationError(
        ex.message,
        ex,
        ex.path?.split('.') ?? [],
        ex.type === 'optionality'
          ? ValidationErrorType.undefinedValue
          : ValidationErrorType.invalidValue,
      )
    }

    return new ValidationError(`Validation error: ${String(ex)}`, ex)
  }

  /**
   * Check if it is a yup validation error instance.
   *
   * @param err Error instance to check.
   */
  private isYupValidationError(err: YupValidationError | unknown): err is YupValidationError {
    return err instanceof Error
      && 'path' in err
      && 'type' in err
  }
}
