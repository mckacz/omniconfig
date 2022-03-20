/**
 * Maps environment variable name to object path and vice-versa.
 */
export interface EnvKeyMapper {
  /**
   * Maps environment variable name to object path.
   * May return `undefined` if provided environment variable name is not supported.
   *
   * @param key Environment variable name.
   */
  keyToPath(key: string): string[] | undefined

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  pathToKey(path: string[]): string
}

/**
 * Checks if given thing is an instance of EnvKeyMapper.
 */
export function isEnvKeyMapper(thing: EnvKeyMapper | unknown): thing is EnvKeyMapper {
  return thing !== undefined
    && thing !== null
    && typeof thing === 'object'
    && 'keyToPath' in thing
    && 'pathToKey' in thing
}
