import { ErrorFormatter } from '../errorFormatters/errorFormatter'
import { ChalkErrorFormatter } from '../errorFormatters/chalkErrorFormatter'
import { TextErrorFormatter } from '../errorFormatters/textErrorFormatter'
import { ResolverError } from '../resolver/resolverError'
import { Resolver } from '../resolver/resolver'

/**
 * Error logger.
 */
export type ErrorLogger = (errorMessage: string) => void

/**
 * Options for error handling preset.
 */
export interface HandleErrorsOptions {
  /**
   * Error formatter.
   */
  formatter?: ErrorFormatter

  /**
   * Error logger.
   * Default: `console.error()`.
   */
  logger?: (errorMessage: string) => void

  /**
   * Exit code. If provided, will be passed to `process.exit()`.
   * Otherwise, `process.exit()` will not be called.
   */
  exitCode?: number
}

/**
 * Creates error formatter instance.
 * @param formatter Error formatter instance.
 */
function formatterFrom(formatter?: ErrorFormatter): ErrorFormatter {
  if (formatter) {
    return formatter
  }

  try {
    // eslint-disable-next-line
    return new ChalkErrorFormatter({ chalk: require('chalk') })
  } catch {
    // Chalk is an optional dependency.
  }

  return new TextErrorFormatter()
}

/**
 * Gets error logger function.
 * @param logger Error logger function.
 */
function loggerFrom(logger?: ErrorLogger): ErrorLogger {
  return logger ?? console.error
}

/**
 * Check if passed value is a promise.
 * @param thing Value to check.
 */
function isPromise<T>(thing: Promise<T> | unknown): thing is Promise<T> {
  return thing !== undefined
    && thing !== null
    && typeof (thing as Promise<T>).then == 'function'
}

/**
 * Resolves configuration using given resolver.
 * Prints an error message when the resolves throw an exception.
 *
 * @param resolver Resolver.
 * @param options Error handling options.
 */
export function resolve<T>(resolver: Resolver<T>, options?: HandleErrorsOptions): T {
  const handleError = (err: unknown) => {
    if (err instanceof ResolverError) {
      const formatter = formatterFrom(options?.formatter)
      const logger = loggerFrom(options?.logger)

      logger(formatter.format(err))

      if (options?.exitCode !== undefined) {
        process.exit(options.exitCode)
      }
    }

    return err
  }

  try {
    const result = resolver.resolve()

    if (isPromise(result)) {
      return result.catch(
        ex => Promise.reject(handleError(ex)),
      ) as unknown as T
    }

    return result
  } catch (ex) {
    throw handleError(ex)
  }
}
