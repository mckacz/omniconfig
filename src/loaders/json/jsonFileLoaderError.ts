import { LoaderError } from '../loaderError'

/**
 * JSON file loader error.
 */
export class JsonFileLoaderError extends LoaderError {
  /**
   * Create a new instance of this error.
   *
   * @param filename A path to JSON file that was attempted to load.
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
