import { ConfresError } from '../confresError.js'
import type { Loader, Reference } from '../loaders/loader.js'
import { ProcessorError, ProcessorErrorType } from '../processors/processorError.js'
import { Processor } from '../processors/processor.js'

export class ResolverError extends ConfresError {
  constructor(
    err: Error | unknown,
    readonly reporter?: Loader<unknown> | Processor<unknown, unknown>,
    readonly source?: Loader<unknown>,
    readonly path?: string,
    readonly references: Reference[] = [],
  ) {
    super(
      err instanceof Error ? err.message : `Configuration resolve error: ${String(err)}`,
      err,
    )
  }

  get isUndefinedError() {
    return this.error instanceof ProcessorError
      && this.error.type === ProcessorErrorType.undefinedValue
  }
}
