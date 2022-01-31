import { EnvLoader } from './envLoader.js'
import { EnvKeyMapper } from './keyMappers/envKeyMapper.js'

/**
 * Loads configuration from Node.js `process.env`.
 */
export class ProcessEnvLoader<T = unknown> extends EnvLoader<T> {
  static readonly container = 'Environment variables'

  /**
   * Creates a new instance of this loader.
   *
   * @param mapper Environment key mapper.
   * @param source Dictionary with environment variables (defaults to process.env).
   */
  constructor(
    mapper: EnvKeyMapper,
    private readonly source = process.env,
  ) {
    super(mapper)
  }

  /**
   * Returns the environment variables.
   */
  protected loadEnv(): Record<string, unknown> {
    return this.source
  }

  /**
   * Returns static container name.
   */
  protected getContainer(): string | undefined {
    return ProcessEnvLoader.container
  }
}
