import _ from 'lodash'
import type { Loader, Reference } from '../loader.js'
import { EnvKeyMapper } from './keyMappers/envKeyMapper.js'

/**
 * Loads and maps environment variables to configuration object.
 */
export abstract class EnvLoader<T = unknown> implements Loader<T> {
  constructor(
    protected readonly mapper: EnvKeyMapper,
  ) {

  }

  /**
   * Loads configuration.
   */
  load(): T {
    return this.mapEnvs(this.loadEnv())
  }

  /**
   * Returns a reference for given configuration object path.
   *
   * @param path Object path.
   */
  referenceFor(path: string): Reference | undefined {
    const container = this.getContainer(path)

    if (!container) {
      return
    }

    const identifier = this.mapper.pathToKey(path)

    return {
      container,
      identifier,
    }
  }

  /**
   * Loads and parsers environment variables.
   * Returns a map of environment variables and its values.
   */
  protected abstract loadEnv(): Record<string, unknown>

  /**
   * Returns container for given object path.
   *
   * @param path Object path.
   */
  protected abstract getContainer(path: string): string | undefined

  /**
   * Maps environment variable to configuration object using
   * configured key mapper.
   *
   * @param env Environment variables map.
   */
  protected mapEnvs(env: Record<string, unknown>): T {
    const values: Record<string, unknown> = {}

    for (const key of Object.getOwnPropertyNames(env)) {
      const path = this.mapper.keyToPath(key)

      if (path) {
        _.set(values, path, env[key])
      }
    }

    return values as T
  }
}
