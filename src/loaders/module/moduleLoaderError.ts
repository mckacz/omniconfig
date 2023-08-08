import { LoaderError } from '../loaderError'

/**
 * Module loader error.
 */
export class ModuleLoaderError extends LoaderError {

}

/**
 * Module loader file load error.
 */
export class ModuleLoaderLoadError extends ModuleLoaderError {
  /**
   * Create a new instance of this error.
   *
   * @param path A path that was attempted to load.
   * @param resolvedPath A resolved path that was attempted to load.
   * @param err The original error.
   */
  constructor(
    readonly path: string,
    readonly resolvedPath: string,
    err: Error | unknown,
  ) {
    super(
      `Unable to load '${path}' ('${resolvedPath}'): ${String(err)}`,
      err,
    )
  }
}
