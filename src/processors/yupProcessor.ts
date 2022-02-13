import type { AnyObjectSchema, Asserts, ValidationError } from 'yup'
import { ProcessorError, ProcessorErrorType } from './processorError'
import { Processor } from './processor'

/**
 * ValidateOptions type (not exported by yup).
 */
type ValidateOptions = Parameters<AnyObjectSchema['validate']>[1]

/**
 * Default validate options for yup.
 */
const defaultValidateOptions: ValidateOptions = { stripUnknown: true }

/**
 * Casts and validates the configuration object using yup schema.
 */
export class YupProcessor<Schema extends AnyObjectSchema> implements Processor<unknown, Asserts<Schema>> {
  /**
   * Creates a new instance of the processor.
   *
   * @param schema Yup schema to check the configuration against.
   * @param validateOptions Options passed to `schema.validateSync()`
   */
  constructor(
    private readonly schema: Schema,
    private readonly validateOptions = defaultValidateOptions,
  ) {
  }

  /**
   * Processes the configuration object.
   *
   * @param payload Data to process.
   */
  async process(payload: unknown): Promise<Asserts<Schema>> {
    try {

      // Return type is determined from passed schema.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return await this.schema.validate(payload, this.validateOptions)

    } catch (ex) {
      if (YupProcessor.isYupValidationError(ex)) {
        throw new ProcessorError(
          ex.message,
          ex,
          ex.path,
          ex.type === 'required'
            ? ProcessorErrorType.undefinedValue
            : ProcessorErrorType.invalidValue,
        )
      }

      throw new ProcessorError(`Processing error: ${String(ex)}`, ex)
    }
  }

  /**
   * Check if it is a yup validation error instance.
   *
   * @param err Error instance to check.
   */
  private static isYupValidationError(err: ValidationError | unknown): err is ValidationError {
    return err instanceof Error
      && 'path' in err
      && 'type' in err
  }
}
