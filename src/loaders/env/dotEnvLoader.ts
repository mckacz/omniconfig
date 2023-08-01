import { readFileSync } from 'fs'
import { DotEnvLoaderError } from './dotEnvLoaderError'
import { EnvLoader } from './envLoader'
import type { EnvKeyMapper } from './keyMappers/envKeyMapper'

/**
 * Loads configuration from .env files.
 */
export class DotEnvLoader<T = unknown> extends EnvLoader<T> {
  /**
   * Create a new instance of this loader.
   *
   * @param mapper      Environment key mapper.
   * @param filename    Path to .env file.
   * @param dotEnvParse parse() function from "dotenv".
   */
  constructor(
    mapper: EnvKeyMapper,
    private readonly filename: string,
    private readonly dotEnvParse: typeof import('dotenv')['parse'],
  ) {
    super(mapper)
  }

  /**
   * Loads and parses configured .env file.
   */
  protected loadEnv(): Record<string, unknown> {
    try {
      const source = readFileSync(this.filename, 'utf-8')

      return this.dotEnvParse(source)
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
}
