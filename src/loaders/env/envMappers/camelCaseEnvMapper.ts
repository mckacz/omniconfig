import _ from 'lodash'
import { SplittingEnvMapper } from './splittingEnvMapper'

/**
 * Maps environment variable names to camelCase object keys.
 */
export class CamelCaseEnvMapper extends SplittingEnvMapper {
  /**
   * Maps environment variable name part to object path part.
   *
   * @param envPart Environment variable name part.
   */
  protected envToPathPart(envPart: string): string {
    return _.camelCase(envPart)
  }

  /**
   * Maps object path part to environment variable name part.
   *
   * @param pathPart Object path part.
   */
  protected pathToEnvPart(pathPart: string): string {
    return _.snakeCase(pathPart).toUpperCase()
  }
}
