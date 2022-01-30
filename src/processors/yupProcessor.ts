import type { AnyObjectSchema, Asserts, ValidationError } from 'yup'
import { ProcessorError, ProcessorErrorType } from './processorError.js'
import { Processor } from './processor.js'

export class YupProcessor<Schema extends AnyObjectSchema> implements Processor<unknown, Asserts<Schema>> {
  constructor(
    private readonly schema: Schema,
  ) {
  }

  process(payload: unknown): Asserts<Schema> {
    try {

      // Return type is determined from passed schema.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.schema.validateSync(payload, { stripUnknown: true })

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

  private static isYupValidationError(err: ValidationError | unknown): err is ValidationError {
    return err instanceof Error
      && 'path' in err
      && 'type' in err
  }
}
