/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { OmniConfig } from './omniConfig'
import { OmniConfigAjv } from './omniConfig.ajv'
import { OmniConfigCore } from './omniConfig.core'
import { OmniConfigEnv } from './omniConfig.env'
import { OmniConfigJson } from './omniConfig.json'
import { OmniConfigResolve } from './omniConfig.resolve'
import { OmniConfigYaml } from './omniConfig.yaml'
import { OmniConfigYup } from './omniConfig.yup'

function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      )
    })
  })
}

applyMixins(
  OmniConfig,
  [
    OmniConfigCore,
    OmniConfigEnv,
    OmniConfigJson,
    OmniConfigYaml,
    OmniConfigYup,
    OmniConfigAjv,
    OmniConfigResolve,
  ]
)

export type { OmniConfigEnvOptions } from './omniConfig.env'
export type { OmniConfigResolveErrorLogger, OmniConfigResolveOptions } from './omniConfig.resolve'
export { OmniConfig }
