import { MetadataBasedKeyMapper, MetadataBasedKeyMapperOptions } from '../loaders/env/keyMappers/metadataBasedKeyMapper'
import { EnvKeyMapper, isEnvKeyMapper } from '../loaders/env/keyMappers/envKeyMapper'
import { OmniConfig } from './omniConfig'
import { ConfresError } from '../errors/confresError'
import * as process from 'process'
import path from 'path'
import { OptionalLoader } from '../loaders/optionalLoader'
import { DotEnvLoader } from '../loaders/env/dotEnvLoader'
import { ProcessEnvLoader } from '../loaders/env/processEnvLoader'

/**
 * Options for loading of .env files.
 */
export interface OmniConfigDotEnvOptions {
  /**
   * Base directory of the .env files.
   * Default: `process.cwd()`
   */
  directory?: string

  /**
   * Load NODE_ENV variant (eg. ".env.development").
   * Default: `false`
   */
  nodeEnvVariant?: boolean

  /**
   * Load local variants (eg. ".env.local", ".env.development.local").
   * Default: `false`
   */
  localVariants?: boolean

  /**
   * Load "dist" variants (eg. ".env.dist", ".env.development.dist").
   * Default: `false`
   */
  distVariants?: boolean
}

/**
 * Options for loading environment variables.
 */
export interface OmniConfigEnvOptions {
  /**
   * .env files options or `true` to load .env files using default options.
   * Default: `false`
   */
  dotEnv?: OmniConfigDotEnvOptions | true

  /**
   * Load configuration from `process.env`.
   * Default: `true`
   */
  processEnv?: boolean

  /**
   * Env key mapper instance OR options for `MetadataBasedKeyMapper`.
   * Default: `MetadataBasedKeyMapper` created using default options.
   */
  envMapper?: EnvKeyMapper | Partial<MetadataBasedKeyMapperOptions>
}

export class OmniConfigEnv<TData> {
  /**
   * Load configuration from environment variables and optionally .env files.
   *
   * @param options Options for loading environment variables.
   */
  useEnvironmentVariables(this: OmniConfig<TData>, options?: OmniConfigEnvOptions): OmniConfig<TData> {
    const mapper = this.getEnvKeyMapper(options?.envMapper)

    const files: string[] = []

    if (options?.dotEnv === true) {
      files.push(...this.getDotEnvFiles())
    } else if (options?.dotEnv) {
      files.push(...this.getDotEnvFiles(options?.dotEnv))
    }

    for (const file of files) {
      this.useLoader(new OptionalLoader(new DotEnvLoader(mapper, file)))
    }

    if (options?.processEnv ?? true) {
      this.useLoader(new ProcessEnvLoader(mapper))
    }

    return this
  }

  /**
   * Get environment variable mapper or create a default one.
   * @param mapper Mapper or options for the default mapper.
   */
  private getEnvKeyMapper(
    this: OmniConfig<TData>,
    mapper?: EnvKeyMapper | Partial<MetadataBasedKeyMapperOptions>
  ): EnvKeyMapper {
    if (isEnvKeyMapper(mapper)) {
      return mapper
    }

    if (!this.model) {
      throw new ConfresError('Model must be set before .useEnvironmentVariables() is called.')
    }

    if (!this.model.getMetadata && !mapper?.metadata) {
      throw new ConfresError('Model does not support returning metadata and metadata has not been provided.')
    }

    return new MetadataBasedKeyMapper({
      metadata: this.model.getMetadata?.() ?? mapper?.metadata ?? [],
      ...mapper,
    })
  }

  /**
   * Get list of .env files to load.
   * @param options .env files options.
   */
  private getDotEnvFiles(this: OmniConfig<TData>, options?: OmniConfigDotEnvOptions): string[] {
    if (options?.localVariants && options?.distVariants) {
      throw new ConfresError('Local .env variants cannot be used together with "dist" variants.')
    }

    const withVariants = (filename: string) => {
      const names: string[] = []

      if (options?.distVariants) {
        names.push(filename + '.dist')
      }

      names.push(filename)

      if (options?.localVariants) {
        names.push(filename + '.local')
      }

      return names
    }

    const mainFile = path.resolve(options?.directory ?? './', '.env')

    const envFiles: string[] = withVariants(mainFile)

    if (options?.nodeEnvVariant) {
      const nodeEnv = process.env.NODE_ENV || 'development'
      envFiles.push(...withVariants(mainFile + '.' + nodeEnv))
    }

    return envFiles
  }
}
