import { Metadata } from './metadata'

/**
 * Configuration model.
 */
export interface Model<TData> {
  /**
   * Get model metadata.
   */
  getMetadata?(): Metadata[]

  /**
   * Asynchronously validate input against the model.
   * @param input Input to validate.
   */
  validate(input: unknown): Promise<TData>

  /**
   * Synchronously validate input against the model.
   * @param input Input to validate.
   */
  validateSync?(input: unknown): TData
}
