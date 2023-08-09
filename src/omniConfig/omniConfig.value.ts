import { ValueLoader } from '../loaders/valueLoader'
import type { OmniConfig } from './omniConfig'

/**
 * OmniConfig - static value support.
 */
export class OmniConfigValue<TData> {
  /**
   * Loads configuration from static value.
   *
   * @param value to use as a configuration.
   * @param sourceOrFrameIndex Value source name or stack trace index to use
   *                           (0 - direct caller; 1 - caller of the caller, etc)
   */
  useValue(
    this: OmniConfig<TData>,
    value: Partial<TData>,
    sourceOrFrameIndex: string | number = 0
  ): OmniConfig<TData> {
    if (typeof sourceOrFrameIndex === 'number') {
      // additional frame to skip for this method
      sourceOrFrameIndex = sourceOrFrameIndex + 1
    }

    return this.useLoader(new ValueLoader(value, sourceOrFrameIndex))
  }
}

