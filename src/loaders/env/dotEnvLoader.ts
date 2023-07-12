import { readFileSync } from 'fs'
import { DotEnvLoaderError } from './dotEnvLoaderError'
import { EnvLoader } from './envLoader'
import type { EnvKeyMapper } from './keyMappers/envKeyMapper'
import { loadDependency } from '../../utils/dependencies'

/**
 * Loads configuration from .env files.
 */
export class DotEnvLoader<T = unknown> extends EnvLoader<T> {
  private static dotEnvParse?: (src: string) => Record<string, unknown>

  /**
   * Create a new instance of this loader.
   *
   * @param mapper   Environment key mapper
   * @param filename Path to .env file.
   */
  constructor(
    mapper: EnvKeyMapper,
    private readonly filename: string,
  ) {
    super(mapper)
  }

  /**
   * Loads and parses configured .env file.
   */
  protected loadEnv(): Record<string, unknown> {
    try {
      const source = readFileSync(this.filename, 'utf-8')

      return this.doParse(source)
    } catch (ex) {
      throw new DotEnvLoaderError(this.filename, ex)
    }
  }

  /**
   * Returns configured filename as a source.
   */
  protected getSource(): string | undefined {
    return this.filename
  }

  /**
   * Parse .env file content using dotenv.
   * @param source .env file content.
   */
  private doParse(source: string) {
    if (!DotEnvLoader.dotEnvParse) {
      DotEnvLoader.dotEnvParse = loadDependency<typeof import('dotenv')>('dotenv').parse
    }

    return DotEnvLoader.dotEnvParse(source)
  }
}
