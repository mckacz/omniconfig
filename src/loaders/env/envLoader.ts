import _ from 'lodash'
import { SyncLoader } from '../syncLoader'
import { EnvKeyMapper } from './keyMappers/envKeyMapper'
import { BasicDataContainer } from '../../dataContainers/basicDataContainer'
import type { Reference } from '../../interfaces/reference'
import type { DataContainer } from '../../interfaces/dataContainer'

/**
 * Loads and maps environment variables to configuration object.
 */
export abstract class EnvLoader<T = unknown> extends SyncLoader<T>{
  protected constructor(
    protected readonly mapper: EnvKeyMapper,
  ) {
    super()
  }

  /**
   * Loads configuration synchronously.
   */
  loadSync(): DataContainer<T> {
    return new BasicDataContainer(this, this.mapEnvs(this.loadEnv()))
  }

  /**
   * Returns a reference for given configuration object path.
   *
   * @param path Object path.
   */
  getReferences(path: string): Reference[] {
    const source = this.getSource(path)

    if (!source) {
      return []
    }

    const identifier = this.mapper.pathToKey(path)

    return [{
      source,
      identifier,
    }]
  }

  /**
   * Loads and parsers environment variables.
   * Returns a map of environment variables and its values.
   */
  protected abstract loadEnv(): Record<string, unknown>

  /**
   * Returns source for given object path.
   *
   * @param path Object path.
   */
  protected abstract getSource(path: string): string | undefined

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
