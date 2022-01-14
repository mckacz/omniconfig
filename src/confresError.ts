export class ConfresError extends Error {
  constructor(
    message: string,
    readonly error?: Error | unknown
  ) {
    super(message)
  }
}
