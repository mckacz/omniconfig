import _ from 'lodash'
import { SplittingKeyMapper } from './splittingKeyMapper'

/**
 * Maps environment variable names to camelCase object keys.
 */
export class CamelCaseKeyMapper extends SplittingKeyMapper {
  /**
   * Maps environment variable name part to object path part.
   *
   * @param keyPart Environment variable name part.
   */
  protected keyToPathPart(keyPart: string): string {
    return _.camelCase(keyPart)
  }

  /**
   * Maps object path part to environment variable name part.
   *
   * @param pathPart Object path part.
   */
  protected pathToKeyPart(pathPart: string): string {
    return _.snakeCase(pathPart).toUpperCase()
  }
}
