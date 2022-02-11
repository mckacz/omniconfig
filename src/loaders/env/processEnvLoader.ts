import { EnvLoader } from './envLoader'
import { EnvKeyMapper } from './keyMappers/envKeyMapper'

/**
 * Loads configuration from Node `process.env`.
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
