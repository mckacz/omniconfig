import { AnyObjectSchema } from 'yup'
import { EnvKeyMapper } from '../loaders/env/keyMappers/envKeyMapper'
import { ErrorFormatter } from '../errorFormatters/errorFormatter'
import { SplittingKeyMapperOptions } from '../loaders/env/keyMappers/splittingKeyMapper'

/**
 * .env related options.
 */
export interface DotEnvPresetOptions {
  /**
   * Base directory of the .env files.
   * Default: `process.cwd()`
   */
  directory?: string

  /**
   * Load NODE_ENV variant (eg. ".env.development").
   * Default: `true`
   */
  nodeEnvVariant?: boolean

  /**
   * Load local variants (eg. ".env.local", ".env.development.local").
   * Default: `true`
   */
  localVariants?: boolean

  /**
   * Load configuration from `process.env`.
   * Default: `true`
   */
  processEnv?: boolean
}

/**
 * Yup related options.
 */
export interface YupEnvPresetOptions<TSchema extends AnyObjectSchema> {
  /**
   * Schema to validate configuration against.
   */
  schema: TSchema

  /**
   * Key mapper instance OR options for `CamelCaseKeyMapper`.
   * Default: `CamelCaseKeyMapper` created using default options.
   */
  keyMapper?: EnvKeyMapper | Partial<SplittingKeyMapperOptions>
}

/**
 * Combination of .env and Yup options.
 */
export type YupDotEnvPresetOptions<TSchema extends AnyObjectSchema> = YupEnvPresetOptions<TSchema> & DotEnvPresetOptions

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
