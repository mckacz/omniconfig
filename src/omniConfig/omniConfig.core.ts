import { Loader } from '../loaders/loader'
import { OptionalLoader } from '../loaders/optionalLoader'
import { Model } from '../model/model'
import { OmniConfig } from './omniConfig'

export class OmniConfigCore<TData> {
  protected loaders?: Loader<unknown>[]
  protected model?: Model<TData>

  withModel<T>(this: OmniConfig<TData>, model: Model<T>): OmniConfig<T> {
    const that: OmniConfig<T> = <never> this
    that.model = model

    return that
  }

  useLoader(loader: Loader<unknown>): this {
    this.loaders = this.loaders ?? []
    this.loaders.push(loader)

    return this
  }

  useOptionalLoader(loader: Loader<unknown>): this {
    return this.useLoader(new OptionalLoader(loader))
  }
}
