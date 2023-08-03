import { Loader } from '../loaders/loader'
import { OptionalLoader } from '../loaders/optionalLoader'
import { Model } from '../model/model'
import { OmniConfig } from './omniConfig'

/**
 * Core functionalities of OmniConfig.
 */
export class OmniConfigCore<TData> {
  /**
   * Sorted list of loaders.
   */
  protected loaders?: Loader<unknown>[]

  /**
   * Model to validate configuration against.
   */
  protected model?: Model<TData>

  /**
   * Set model to validate configuration against.
   * If model is not set, validation will not be performed.
   *
   * @param model Model instance.
   */
  withModel<T>(this: OmniConfig<TData>, model?: Model<T>): OmniConfig<T> {
    const that: OmniConfig<T> = <never> this
    that.model = model

    return that
  }

  /**
   * Adds new loader to the list.
   *
   * @param loader Loader instance.
   */
  useLoader(loader: Loader<unknown>): this {
    this.loaders = this.loaders ?? []
    this.loaders.push(loader)

    return this
  }

  /**
   * Adds new optional loader to the list.
   * Errors thrown by optional loaders are ignored.
   *
   * @param loader Loader instance.
   */
  useOptionalLoader(loader: Loader<unknown>): this {
    return this.useLoader(new OptionalLoader(loader))
  }
}
