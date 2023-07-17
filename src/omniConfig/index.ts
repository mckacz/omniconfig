/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { OmniConfig } from './omniConfig'
import { OmniConfigCore } from './omniConfig.core'
import { OmniConfigEnv } from './omniConfig.env'
import { OmniConfigResolve } from './omniConfig.resolve'
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
    OmniConfigResolve,
    OmniConfigEnv,
    OmniConfigYup,
  ]
)

export type { OmniConfigEnvOptions } from './omniConfig.env'
export type { OmniConfigResolveErrorLogger, OmniConfigResolveOptions } from './omniConfig.resolve'
export { OmniConfig }
