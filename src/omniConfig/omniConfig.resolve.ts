import { loadDependency } from '../common/dependencies'
import { ChalkErrorFormatter } from '../errorFormatters/chalkErrorFormatter'
import { TextErrorFormatter } from '../errorFormatters/textErrorFormatter'
import { AsyncResolver } from '../resolver/asyncResolver'
import { ResolverError } from '../resolver/resolverError'
import { SyncResolver } from '../resolver/syncResolver'
import type { OmniConfig } from './omniConfig'
import type { ErrorFormatter } from '../errorFormatters/errorFormatter'
import type { Model } from '../model/model'

/**
 * Logger interface.
 */
export interface OmniConfigResolveErrorLogger {
  log(message: string): void
  error(errorMessage: string): void
}

/**
 * Options for OmniConfig.resolve()
 */
export interface OmniConfigResolveOptions {
  /**
   * Error logger.
   * Default: `console`.
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

/**
 * OmniConfig - configuration resolving.
 */
export class OmniConfigResolve<TData> {
  /**
   * Load and validate the configuration asynchronously.
   *
   * Resolving process consists of:
   *   1. load configuration objects using registered loaders
   *   2. merge each object - options loaded by the next loader overwrites the previous values
   *   3. validate the merged configuration object using registered model
   *   4. optionally handle validation errors
   *
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
   *
   * Resolving process consists of:
   *   1. load configuration objects using registered loaders
   *   2. merge each object - options loaded by the next loader overwrites the previous values
   *   3. validate the merged configuration object using registered model
   *   4. optionally handle validation errors
   *
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

      logger.error(formatter.format(err))

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
      ? new ChalkErrorFormatter({ chalk })
      : new TextErrorFormatter()
  }

  /**
   * Returns provided error logger or creates a default one.
   *
   * @param logger Error logger function.
   */
  private getErrorLogger(logger?: OmniConfigResolveErrorLogger | false): OmniConfigResolveErrorLogger {
    if (logger === false) {
      return {
        log: () => null,
        error: () => null,
      }
    } else if (logger) {
      return logger
    }

    return console
  }
}
