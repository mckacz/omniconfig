import { ResolverError } from '../errors/resolverError'

/**
 * Formats ResolverError as human-readable message.
 */
export interface ErrorFormatter {
  /**
   * Formats ResolverError as human-readable message.
   *
   * @param err ResolverError instance to describe.
   */
  format(err: ResolverError): string
}
