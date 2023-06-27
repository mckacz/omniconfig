import { LoaderError } from '../../errors/loaderError'

/**
 * YAML file loader error.
 */
export class YamlFileLoaderError extends LoaderError {
  /**
   * Create a new instance of this error.
   *
   * @param filename A path to YAML file that was attempted to load.
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
