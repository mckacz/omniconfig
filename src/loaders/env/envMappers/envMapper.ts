/**
 * Maps environment variable name to object path and vice-versa.
 */
export interface EnvMapper {
  /**
   * Maps environment variable name to object path.
   * May return `undefined` if provided environment variable name is not supported.
   *
   * @param env Environment variable name.
   */
  envToPath(env: string): string[] | undefined

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  pathToEnv(path: string[]): string  | undefined
}

/**
 * Checks if given thing is an instance of EnvMapper.
 */
export function isEnvKeyMapper(thing: EnvMapper | unknown): thing is EnvMapper {
  return thing !== undefined
    && thing !== null
    && typeof thing === 'object'
    && 'envToPath' in thing
    && 'pathToEnv' in thing
}
