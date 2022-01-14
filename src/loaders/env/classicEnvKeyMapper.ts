import _ from 'lodash'
import type { EnvKeyMapper } from './envKeyMapper.js'

export interface ClassicEnvKeyMapperOptions {
  prefix: string
  separator: string
}

const defaultOptions: ClassicEnvKeyMapperOptions = {
  prefix:    '',
  separator: '__',
}

export class ClassicEnvKeyMapper implements EnvKeyMapper {
  private readonly prefix: string
  private readonly separator: string

  constructor(options?: Partial<ClassicEnvKeyMapperOptions>) {
    this.prefix = options?.prefix ?? defaultOptions.prefix
    this.separator = options?.separator ?? defaultOptions.separator
  }

  keyToPath(key: string): string | undefined {
    if (!key.startsWith(this.prefix)) {
      return
    }

    return key.substring(this.prefix.length)
      .split(this.separator)
      .map(part => _.camelCase(part))
      .join('.')
  }

  pathToKey(path: string): string {
    const key = path.split('.')
      .map(part => _.snakeCase(part).toUpperCase())
      .join(this.separator)

    return this.prefix + key
  }
}
