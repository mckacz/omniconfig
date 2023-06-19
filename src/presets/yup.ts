/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path'
import type { Asserts, ObjectSchema } from 'yup'
import { AsyncResolver } from '../resolver/asyncResolver'
import { YupProcessor } from '../processors/yupProcessor'
import { OptionalLoader } from '../loaders/optionalLoader'
import { DotEnvLoader } from '../loaders/env/dotEnvLoader'
import { ProcessEnvLoader } from '../loaders/env/processEnvLoader'
import { EnvKeyMapper, isEnvKeyMapper } from '../loaders/env/keyMappers/envKeyMapper'
import { CamelCaseKeyMapper } from '../loaders/env/keyMappers/camelCaseKeyMapper'
import { SplittingKeyMapperOptions } from '../loaders/env/keyMappers/splittingKeyMapper'
import { Loader } from '../loaders/loader'
import { Resolver } from '../resolver/resolver'
import { Processor } from '../processors/processor'
import { SyncResolver } from '../resolver/syncResolver'

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
export interface YupEnvPresetOptions<TSchema extends ObjectSchema<any>> {
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
export type YupDotEnvPresetOptions<TSchema extends ObjectSchema<any>> = YupEnvPresetOptions<TSchema> & DotEnvPresetOptions

/**
 * Creates a list of .env files to load.
 *
 * @param options .env options.
 */
function getEnvFiles(options: DotEnvPresetOptions): string[] {
  const withLocal = (filename: string) => options.localVariants ? [filename, filename + '.local'] : [filename]
  const mainFile = path.resolve(options.directory ?? './', '.env')

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
 * Returns arguments for resolver with ProcessEnvLoader and YupProcessor.
 *
 * @param options Resolver options.
 */
function yupEnvArgs<TSchema extends ObjectSchema<any>>(options: YupEnvPresetOptions<TSchema>): [Loader<unknown>[], Processor<unknown, unknown>[]] {
  return [
    [
      new ProcessEnvLoader(keyMapperFrom(options.keyMapper)),
    ],
    [
      new YupProcessor(options.schema),
    ],
  ]
}

/**
 * Returns arguments for resolver with DotEnvLoader, ProcessEnvLoader and YupProcessor.
 *
 * @param options Resolver options.
 */
function yupDotEnvArgs<TSchema extends ObjectSchema<any>>(options: YupDotEnvPresetOptions<TSchema>): [Loader<unknown>[], Processor<unknown, unknown>[]] {
  options = {
    localVariants:  true,
    nodeEnvVariant: true,
    processEnv:     true,
    ...options,
  }

  const envFiles = getEnvFiles(options)
  const keyMapper = keyMapperFrom(options.keyMapper)

  const loaders: Loader<unknown>[] = envFiles.map(
    file => new OptionalLoader(new DotEnvLoader(keyMapper, file)),
  )

  if (options.processEnv) {
    loaders.push(new ProcessEnvLoader(keyMapper))
  }

  return [
    loaders,
    [
      new YupProcessor(options.schema),
    ],
  ]
}

/**
 * Creates an asynchronous resolver with ProcessEnvLoader and YupProcessor.
 *
 * @param options Resolver options.
 */
export function yupEnv<TSchema extends ObjectSchema<any>>(options: YupEnvPresetOptions<TSchema>): Resolver<Promise<Asserts<TSchema>>> {
  return new AsyncResolver(...yupEnvArgs(options))
}

/**
 * Creates a synchronous resolver with ProcessEnvLoader and YupProcessor.
 *
 * @param options Resolver options.
 */
export function yupEnvSync<TSchema extends ObjectSchema<any>>(options: YupEnvPresetOptions<TSchema>): Resolver<Asserts<TSchema>> {
  return new SyncResolver(...yupEnvArgs(options))
}

/**
 * Creates an asynchronous resolver with DotEnvLoader, ProcessEnvLoader and YupProcessor
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
export function yupDotEnv<TSchema extends ObjectSchema<any>>(options: YupDotEnvPresetOptions<TSchema>): Resolver<Promise<Asserts<TSchema>>> {
  return new AsyncResolver<Asserts<TSchema>>(...yupDotEnvArgs(options))
}

/**
 * Creates a synchronous resolver with DotEnvLoader, ProcessEnvLoader and YupProcessor
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
export function yupDotEnvSync<TSchema extends ObjectSchema<any>>(options: YupDotEnvPresetOptions<TSchema>): Resolver<Asserts<TSchema>> {
  return new SyncResolver<Asserts<TSchema>>(...yupDotEnvArgs(options))
}
