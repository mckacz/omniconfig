import { parse } from 'dotenv'
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

      return parse(source)
    } catch (ex) {
      throw new DotEnvLoaderError(this.filename, ex)
    }
  }

  /**
   * Returns configured filename as a container.
   */
  protected getContainer(): string | undefined {
    return this.filename
  }
}
