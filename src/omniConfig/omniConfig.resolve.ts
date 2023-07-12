import type { OmniConfig } from './omniConfig'
import type { ErrorFormatter } from '../interfaces/errorFormatter'
import { ResolverError } from '../errors/resolverError'
import { loadDependency } from '../utils/dependencies'
import { ChalkErrorFormatter } from '../errorFormatters/chalkErrorFormatter'
import { TextErrorFormatter } from '../errorFormatters/textErrorFormatter'
import { AsyncResolver } from '../resolver/asyncResolver'
import type { Model } from '../interfaces/model'
import { SyncResolver } from '../resolver/syncResolver'

export interface OmniConfigResolveErrorLogger {
  (errorMessage: string): void
}

/**
 * Options for OmniConfig.resolve()
 */
export interface OmniConfigResolveOptions {
  /**
   * Error logger.
   * Default: `console.error()`.
   */
  logger?: OmniConfigResolveErrorLogger | false

  /**
   * Error formatter.
   * Default: `ChalkErrorFormatter` if `chalk` is available, otherwise: `TextErrorFormatter`.
   */
  formatter?: ErrorFormatter

  /**
   * Exit code. If provided, will be passed to `process.exit()`.
   * Otherwise, `process.exit()` will not be called.
   */
  exitCode?: number
}

export class OmniConfigResolve<TData> {
  /**
   * Load and validate the configuration asynchronously.
   * @param options Error handling options.
   */
  async resolve(this: OmniConfig<TData>, options?: OmniConfigResolveOptions): Promise<TData> {
    const resolver = new AsyncResolver(this.loaders ?? [], this.model as Model<Promise<TData>>)

    try {
      return await resolver.resolve()
    } catch (ex) {
      throw this.handleError(ex, options)
    }
  }

  /**
   * Load and validate the configuration synchronously.
   * @param options Error handling options.
   */
  resolveSync(this: OmniConfig<TData>, options?: OmniConfigResolveOptions): TData {
    const resolver = new SyncResolver(this.loaders ?? [], this.model)

    try {
      return resolver.resolve()
    } catch (ex) {
      throw this.handleError(ex, options)
    }
  }

  /**
   * Handles error thrown during configuration resolution.
   *
   * @param err Error object.
   * @param options Resolve options.
   */
  private handleError(err: unknown, options?: OmniConfigResolveOptions): unknown {
    if (err instanceof ResolverError) {
      const formatter = this.getErrorFormatter(options?.formatter)
      const logger = this.getErrorLogger(options?.logger)

      logger(formatter.format(err))

      if (options?.exitCode !== undefined) {
        process.exit(options.exitCode)
      }
    }

    return err
  }

  /**
   * Returns provided error formatter or creates a default one.
   *
   * @param formatter Error formatter instance
   */
  private getErrorFormatter(formatter?: ErrorFormatter): ErrorFormatter {
    if (formatter) {
      return formatter
    }

    const chalk = loadDependency<typeof import('chalk')>('chalk', false)

    return chalk
      ? new ChalkErrorFormatter({chalk})
      : new TextErrorFormatter()
  }

  /**
   * Returns provided error logger or creates a default one.
   *
   * @param logger Error logger function.
   */
  private getErrorLogger(logger?: OmniConfigResolveErrorLogger | false): OmniConfigResolveErrorLogger {
    if (logger === false) {
      return () => null
    } else if (logger) {
      return logger
    }

    return console.error
  }
}
