import { parse } from 'dotenv'
import { readFileSync } from 'fs'
import { DotEnvLoaderError } from './dotEnvLoaderError.js'
import { EnvLoader } from './envLoader.js'
import type { EnvKeyMapper } from './envKeyMapper.js'

export class DotEnvLoader<T = unknown> extends EnvLoader<T> {
  constructor(
    mapper: EnvKeyMapper,
    private readonly filename: string,
  ) {
    super(mapper)
  }

  load(): T {
    let source = ''

    try {
      source = readFileSync(this.filename, 'utf-8')
    } catch (ex) {
      throw new DotEnvLoaderError(this.filename, ex)
    }

    return this.loadEnv(parse(source))
  }

  protected getContainer(): string | undefined {
    return this.filename
  }
}
