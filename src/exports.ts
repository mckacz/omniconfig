export type { Reference, Loader } from './loaders/loader'
export type { Processor } from './processors/processor'
export type { EnvKeyMapper } from './loaders/env/keyMappers/envKeyMapper'
export type { ErrorFormatter } from './errorFormatters/errorFormatter'
export type { Resolver } from './resolver/resolver'
export type {
  HandleErrorsOptions,
  ErrorLogger,
  DotEnvPresetOptions,
  YupEnvPresetOptions,
  YupDotEnvPresetOptions,
} from './presets'

export * from './confresError'

export * from './resolver/syncResolver'
export * from './resolver/asyncResolver'
export * from './resolver/resolverError'

export * from './loaders/loaderError'
export * from './loaders/valueLoader'
export * from './loaders/optionalLoader'

export * from './loaders/json/jsonFileLoader'
export * from './loaders/json/jsonFileLoaderError'

export * from './loaders/env/envLoader'
export * from './loaders/env/processEnvLoader'
export * from './loaders/env/dotEnvLoader'
export * from './loaders/env/keyMappers/splittingKeyMapper'
export * from './loaders/env/keyMappers/camelCaseKeyMapper'
export * from './loaders/env/keyMappers/snakeCaseKeyMapper'

export * from './processors/processorError'
export * from './processors/yupProcessor'

export * from './errorFormatters/textErrorFormatter'
export * from './errorFormatters/chalkErrorFormatter'

import Presets from './presets'
export default Presets
