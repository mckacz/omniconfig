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
import { DotEnvPresetOptions, YupDotEnvPresetOptions, YupEnvPresetOptions } from './options'

/**
 * Creates a environment key mapper form options.
 */
function keyMapperFrom(keyMapper?: EnvKeyMapper | Partial<SplittingKeyMapperOptions>): EnvKeyMapper {
  if (isEnvKeyMapper(keyMapper)) {
    return keyMapper
  }

  return new CamelCaseKeyMapper(keyMapper)
}

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
}

export default presets
