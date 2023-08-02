import { BaseEnvMapper } from './baseEnvMapper'

/**
 * Maps environment variable names by splitting them using provided separator.
 */
export abstract class SplittingEnvMapper extends BaseEnvMapper {
  /**
   * Maps environment variable name to object path.
   * May return `undefined` if provided environment variable name does not start with configured prefix.
   *
   * @param key Environment variable name.
   */
  envToPath(key: string): string[] | undefined {
    if (!key.startsWith(this.prefix)) {
      return
    }

    return key.substring(this.prefix.length)
      .split(this.separator)
      .map(part => this.envToPathPart(part))
  }

  /**
   * Maps object path to environment variable name.
   *
   * @param path Object path to map.
   */
  pathToEnv(path: string[]): string {
    const key = path
      .map(part => this.pathToEnvPart(part))
      .join(this.separator)

    return this.prefix + key
  }

  /**
   * Maps environment variable name part to object path part.
   *
   * @param keyPart Environment variable name part.
   */
  protected abstract envToPathPart(keyPart: string): string

  /**
   * Maps object path part to environment variable name part.
   *
   * @param pathPart Object path part.
   */
  protected abstract pathToEnvPart(pathPart: string): string
}
