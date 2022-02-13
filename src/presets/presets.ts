import type { AnyObjectSchema, Asserts } from 'yup'
import * as path from 'path'
import { Resolver } from '../resolver/resolver'
import { YupProcessor } from '../processors/yupProcessor'
import { OptionalLoader } from '../loaders/optionalLoader'
import { DotEnvLoader } from '../loaders/env/dotEnvLoader'
import { ProcessEnvLoader } from '../loaders/env/processEnvLoader'
import { EnvKeyMapper, isEnvKeyMapper } from '../loaders/env/keyMappers/envKeyMapper'
import { CamelCaseKeyMapper } from '../loaders/env/keyMappers/camelCaseKeyMapper'
import { SplittingKeyMapperOptions } from '../loaders/env/keyMappers/splittingKeyMapper'
import {
  DotEnvPresetOptions,
  ErrorLogger,
  HandleErrorsOptions,
  YupDotEnvPresetOptions,
  YupEnvPresetOptions,
} from './options'
import { ErrorFormatter } from '../errorFormatters/errorFormatter'
import { ChalkErrorFormatter } from '../errorFormatters/chalkErrorFormatter'
import { TextErrorFormatter } from '../errorFormatters/textErrorFormatter'
import { ResolverError } from '../resolver/resolverError'

/**
 * Creates a list of .env files to load.
 *
 * @param options .env options.
 */
function getEnvFiles(options: DotEnvPresetOptions): string[] {
  options = {
    directory:      process.cwd(),
    localVariants:  true,
    nodeEnvVariant: true,
    ...options,
  }

  const withLocal = (filename: string) => options.localVariants ? [filename, filename + '.local'] : [filename]
  const mainFile = path.resolve(options.directory, '.env')

  const envFiles: string[] = withLocal(mainFile)

  if (options.nodeEnvVariant) {
    const nodeEnv = process.env.NODE_ENV || 'development'
    envFiles.push(...withLocal(mainFile + '.' + nodeEnv))
  }

  return envFiles
}

/**
 * Creates a environment key mapper form options.
 *
 * @param keyMapper Key mapper instance of options for CamelCaseKeyMapper.
 */
function keyMapperFrom(keyMapper?: EnvKeyMapper | Partial<SplittingKeyMapperOptions>): EnvKeyMapper {
  if (isEnvKeyMapper(keyMapper)) {
    return keyMapper
  }

  return new CamelCaseKeyMapper(keyMapper)
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
 * Syntactic sugar to get preconfigured resolvers.
 */
const presets = {
  /**
   * Creates a resolver with ProcessEnvLoader and YupProcessor.
   *
   * @param options Resolver options.
   */
  yupEnv<TSchema extends AnyObjectSchema>(options: YupEnvPresetOptions<TSchema>): Resolver<Asserts<TSchema>> {
    return new Resolver<Asserts<TSchema>>(
      [
        new ProcessEnvLoader(keyMapperFrom(options.keyMapper)),
      ],
      [
        new YupProcessor(options.schema),
      ],
    )
  },

  /**
   * Creates a resolver with DotEnvLoader, ProcessEnvLoader and YupProcessor
   * that will load / merge configurations in the following order:
   *
   *   1. optional `.env` file
   *   2. optional `.env.local` file (if local variants enabled)
   *   3. optional `.env.development` file (if NODE_ENV-based variants enabled)
   *   4. optional `.env.development.local` file (if local and NODE_ENV-based variants enabled)
   *   5. environment variables of the process
   *
   * @param options Resolver options.
   */
  yupDotEnv<TSchema extends AnyObjectSchema>(options: YupDotEnvPresetOptions<TSchema>): Resolver<Asserts<TSchema>> {
    const envFiles = getEnvFiles(options)
    const keyMapper = keyMapperFrom(options.keyMapper)

    return new Resolver(
      [
        ...envFiles.map(file => new OptionalLoader(new DotEnvLoader(keyMapper, file))),
        new ProcessEnvLoader(keyMapper),
      ],
      [
        new YupProcessor(options.schema),
      ],
    )
  },

  /**
   * Resolves configuration using given resolver.
   * Prints an error message when the resolves throw an exception.
   *
   * @param resolver Resolver.
   * @param options Error handling options.
   */
  async resolve<T>(resolver: Resolver<T>, options?: HandleErrorsOptions): Promise<T> {
    try {
      return await resolver.resolve()
    } catch (ex) {
      if (!(ex instanceof ResolverError)) {
        throw ex
      }

      const formatter = formatterFrom(options?.formatter)
      const logger = loggerFrom(options?.logger)

      logger(formatter.format(ex))

      if(options?.exitCode !== undefined) {
        process.exit(options.exitCode)
      }

      throw ex
    }
  },
}

export default presets
