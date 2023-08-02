import { ConfresError } from './confresError'

/**
 * Error class for the missing peer dependency.
 */
export class MissingDependencyError extends ConfresError {
  constructor(readonly pkg: string, originalError?: unknown) {
    super(`Missing dependency "${pkg}". Please install it to use current configuration.`, originalError)
  }
}

/**
 * Load peer dependency.
 *
 * @param pkg Package name to load.
 */
export function loadDependency<T = unknown>(pkg: string): T
export function loadDependency<T = unknown>(pkg: string, required: false): T | undefined
export function loadDependency<T = unknown>(pkg: string, required = true): T | undefined {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(pkg) as T
  } catch (ex) {
    if (required) {
      throw new MissingDependencyError(pkg, ex)
    }
  }
}
