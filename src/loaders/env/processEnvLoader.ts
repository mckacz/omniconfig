import { EnvLoader } from './envLoader'
import { EnvMapper } from './envMappers/envMapper'

/**
 * Loads configuration from Node `process.env`.
 */
export class ProcessEnvLoader<T = unknown> extends EnvLoader<T> {
  static readonly source = 'Environment variables'

  /**
   * Creates a new instance of this loader.
   *
   * @param mapper Environment key mapper.
   * @param source Dictionary with environment variables (defaults to process.env).
   */
  constructor(
    mapper: EnvMapper,
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
   * Returns static source name.
   */
  protected getSource(): string | undefined {
    return ProcessEnvLoader.source
  }
}
