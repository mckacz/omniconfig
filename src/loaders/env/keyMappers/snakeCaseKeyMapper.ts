import { SplittingKeyMapper } from './splittingKeyMapper'

/**
 * Maps environment variable names to lower snakeCase object keys.
 */
export class SnakeCaseKeyMapper extends SplittingKeyMapper {
  /**
   * Maps environment variable name part to object path part.
   *
   * @param keyPart Environment variable name part.
   */
  protected keyToPathPart(keyPart: string): string {
    return keyPart.toLowerCase()
  }

  /**
   * Maps object path part to environment variable name part.
   *
   * @param pathPart Object path part.
   */
  protected pathToKeyPart(pathPart: string): string {
    return pathPart.toUpperCase()
  }
}
