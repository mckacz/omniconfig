import { LoaderError } from '../loaderError'

export class DotEnvLoaderError extends LoaderError {
  constructor(path: string, err: Error | unknown) {
    super(`Unable to load environment file '${path}': ${String(err)}`, err)
  }
}
