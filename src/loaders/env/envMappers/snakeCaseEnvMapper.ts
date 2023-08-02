import { SplittingEnvMapper } from './splittingEnvMapper'

/**
 * Maps environment variable names to lower snakeCase object keys.
 */
export class SnakeCaseEnvMapper extends SplittingEnvMapper {
  /**
   * Maps environment variable name part to object path part.
   *
   * @param keyPart Environment variable name part.
   */
  protected envToPathPart(keyPart: string): string {
    return keyPart.toLowerCase()
  }

  /**
   * Maps object path part to environment variable name part.
   *
   * @param pathPart Object path part.
   */
  protected pathToEnvPart(pathPart: string): string {
    return pathPart.toUpperCase()
  }
}
