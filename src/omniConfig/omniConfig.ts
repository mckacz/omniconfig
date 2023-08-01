import type { OmniConfigAjv } from './omniConfig.ajv'
import type { OmniConfigCore } from './omniConfig.core'
import type { OmniConfigEnv } from './omniConfig.env'
import type { OmniConfigJson } from './omniConfig.json'
import type { OmniConfigResolve } from './omniConfig.resolve'
import type { OmniConfigYaml } from './omniConfig.yaml'
import type { OmniConfigYup } from './omniConfig.yup'

export class OmniConfig {

}

export interface OmniConfig<TData = unknown> extends OmniConfigCore<TData>,
  OmniConfigResolve<TData>,
  OmniConfigEnv<TData>,
  OmniConfigJson<TData>,
  OmniConfigYaml<TData>,
  OmniConfigAjv<TData>,
  OmniConfigYup<TData> {
}
