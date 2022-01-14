import { ConfresError } from '../confresError.js'

export enum ProcessorErrorType {
  generic,
  invalidValue,
  undefinedValue,
}

export class ProcessorError extends ConfresError {
  constructor(
    message: string,
    innerError?: Error | unknown,
    readonly path?: string,
    readonly type = ProcessorErrorType.generic,
  ) {
    super(message, innerError)
  }
}
