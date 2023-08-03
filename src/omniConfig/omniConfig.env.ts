import { loadDependency } from '../common/dependencies'
import { OmniConfigError } from '../common/omniConfigError'
import { ConfigFileVariantFn, configFileVariantFnFromTemplate, getConfigFileVariants } from '../common/variants'
import { DotEnvLoader } from '../loaders/env/dotEnvLoader'
import { EnvMapper, isEnvKeyMapper } from '../loaders/env/envMappers/envMapper'
import { MetadataBasedEnvMapper, MetadataBasedEnvMapperOptions } from '../loaders/env/envMappers/metadataBasedEnvMapper'
import { ProcessEnvLoader } from '../loaders/env/processEnvLoader'
import { OmniConfig } from './omniConfig'

/**
 * Options for loading environment variables.
 */
export interface OmniConfigEnvOptions {
  /**
   * Option for .env files.
   *
   * If `true` is passed, only `.env` from the current directory will be loaded.
   *
   * If string is passed, it is considered as a file name template with optional placeholders and directory.
   * Check `configFileVariantFnFromTemplate()` for details.
   *
   * If function is passed, it is used to generate file name variants.
   * Check `getConfigFileVariants()` for defaults.
   *
   * @examples
   *  `false`                       - Do not load `.env` files.
   *  `true`                        - Load only `.env` file.
   *  `.env[.local]                 - Load `.env` and `.env.local` files.
   *  `config/[node_env].env[.dist] - Load `config/development.env.dist` and `config/development.env` files
   *                                  (assuming `NODE_ENV` is `development`).
   * @default `false`
   *
   * @see getConfigFileVariants()
   * @see configFileVariantFnFromTemplate()
   */
  dotEnv?: true | string | ConfigFileVariantFn

  /**
   * Load configuration from `process.env`.
   * Default: `true`
   */
  processEnv?: boolean

  /**
   * Env key mapper instance OR options for `MetadataBasedKeyMapper`.
   * Default: `MetadataBasedKeyMapper` created using default options.
   */
  envMapper?: EnvMapper | Partial<MetadataBasedEnvMapperOptions>
}

/**
 * OmniConfig - environment variable support.
 */
export class OmniConfigEnv<TData> {
  /**
   * Load configuration from environment variables and optionally .env files.
   *
   * @param options Options for loading environment variables.
   */
  useEnvironmentVariables(this: OmniConfig<TData>, options?: OmniConfigEnvOptions): OmniConfig<TData> {
    const parse = loadDependency<typeof import('dotenv')>('dotenv').parse
    const mapper = this.getEnvKeyMapper(options?.envMapper)

    const files: string[] = []

    if (options?.dotEnv === true) {
      files.push('.env')
    } else if (typeof options?.dotEnv === 'string') {
      files.push(...getConfigFileVariants(configFileVariantFnFromTemplate(options?.dotEnv)))
    } else if (typeof options?.dotEnv === 'function') {
      files.push(...getConfigFileVariants(options?.dotEnv))
    }

    for (const file of files) {
      this.useOptionalLoader(new DotEnvLoader(mapper, file, parse))
    }

    if (options?.processEnv ?? true) {
      this.useLoader(new ProcessEnvLoader(mapper))
    }

    return this
  }

  /**
   * Get environment variable mapper or create a default one.
   *
   * @param mapper Mapper or options for the default mapper.
   */
  private getEnvKeyMapper(
    this: OmniConfig<TData>,
    mapper?: EnvMapper | Partial<MetadataBasedEnvMapperOptions>
  ): EnvMapper {
    if (isEnvKeyMapper(mapper)) {
      return mapper
    }

    if (!this.model) {
      throw new OmniConfigError('Model must be set before .useEnvironmentVariables() is called.')
    }

    if (!this.model.getMetadata && !mapper?.metadata) {
      throw new OmniConfigError('Model does not support returning metadata and metadata has not been provided.')
    }

    return new MetadataBasedEnvMapper({
      metadata: this.model.getMetadata?.() ?? mapper?.metadata ?? [],
      ...mapper,
    })
  }
}
