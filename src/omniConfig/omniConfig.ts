import type { OmniConfigCore } from './omniConfig.core'
import type { OmniConfigEnv } from './omniConfig.env'
import type { OmniConfigResolve } from './omniConfig.resolve'
import type { OmniConfigYup } from './omniConfig.yup'

export class OmniConfig {

}

export interface OmniConfig<TData = unknown> extends OmniConfigCore<TData>,
  OmniConfigResolve<TData>,
  OmniConfigEnv<TData>,
  OmniConfigYup<TData> {
}
