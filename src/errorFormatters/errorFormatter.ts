import { ResolverError } from '../resolver/resolverError'

/**
 * Formats ResolverError as human-readable message.
 */
export interface ErrorFormatter {
  /**
   * Formats ResolverError as human-readable message.
   * For any other error instances returns undefined.
   *
   * @param err ResolverError instance to describe.
   */
  format(err: ResolverError | unknown): string | undefined
}
