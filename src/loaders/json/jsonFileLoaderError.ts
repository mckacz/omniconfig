import { LoaderError } from '../loaderError.js'

export class JsonFileLoaderError extends LoaderError {
  constructor(
    readonly filename: string,
    err: Error | unknown,
  ) {
    super(
      `Unable to load file '${filename}': ${String(err)}`,
      err,
    )
  }
}
