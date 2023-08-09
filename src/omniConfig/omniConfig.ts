import type { OmniConfigAjv } from './omniConfig.ajv'
import type { OmniConfigCore } from './omniConfig.core'
import type { OmniConfigEnv } from './omniConfig.env'
import type { OmniConfigJs } from './omniConfig.jsModule'
import type { OmniConfigJson } from './omniConfig.json'
import type { OmniConfigResolve } from './omniConfig.resolve'
import type { OmniConfigValue } from './omniConfig.value'
import type { OmniConfigYaml } from './omniConfig.yaml'
import type { OmniConfigYup } from './omniConfig.yup'

/**
 * OmniConfig high-level interface.
 *
 * The implementation of specific functionalities can be found in mixins.
 */
export class OmniConfig { }

/**
 * OmniConfig high-level interface.
 */
export interface OmniConfig<TData = unknown> extends OmniConfigCore<TData>,
  OmniConfigResolve<TData>,
  OmniConfigEnv<TData>,
  OmniConfigJs<TData>,
  OmniConfigJson<TData>,
  OmniConfigValue<TData>,
  OmniConfigYaml<TData>,
  OmniConfigAjv<TData>,
  OmniConfigYup<TData> {
}
