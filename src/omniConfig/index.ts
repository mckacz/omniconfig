/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-explicit-any */
import { OmniConfigCore } from './omniConfig.core'
import { OmniConfig } from './omniConfig'
import { OmniConfigResolve } from './omniConfig.resolve'
import { OmniConfigEnv } from './omniConfig.env'
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
    OmniConfigYup
  ]
)

export type { OmniConfigDotEnvOptions, OmniConfigEnvOptions } from './omniConfig.env'
export type { OmniConfigResolveErrorLogger, OmniConfigResolveOptions } from './omniConfig.resolve'
export { OmniConfig }
