import { EnvLoader } from './envLoader.js'

export class ProcessEnvLoader<T = unknown> extends EnvLoader<T> {
  static readonly container = 'Environment variables'

  load(): T {
    return this.loadEnv(process.env)
  }

  protected getContainer(): string | undefined {
    return ProcessEnvLoader.container
  }
}
