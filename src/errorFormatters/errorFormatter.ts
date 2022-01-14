import { ResolverError } from '../resolver/resolverError.js'

export interface ErrorFormatter {
  format(err: ResolverError | unknown): string | undefined
}
