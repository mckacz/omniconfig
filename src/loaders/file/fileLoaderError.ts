import { LoaderError } from '../loaderError'

/**
 * File loader error.
 */
export class FileLoaderError extends LoaderError {
  /**
   * Create a new instance of this error.
   *
   * @param filename A path of file that was attempted to load.
   * @param err The original error.
   */
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
