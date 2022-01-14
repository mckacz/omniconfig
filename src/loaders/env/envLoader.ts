import _ from 'lodash'
import type { Loader, Reference } from '../loader.js'
import { EnvKeyMapper } from './envKeyMapper.js'

export abstract class EnvLoader<T = unknown> implements Loader<T> {
  constructor(
    protected readonly mapper: EnvKeyMapper,
  ) {

  }

  abstract load(): T

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

  protected abstract getContainer(path: string): string | undefined

  protected loadEnv(env: Record<string, unknown>): T {
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
