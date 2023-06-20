export type { Loader } from './interfaces/loader'
export type { Reference } from './interfaces/reference'
export type { Validator } from './interfaces/validator'
export type { EnvKeyMapper } from './loaders/env/keyMappers/envKeyMapper'
export type { ErrorFormatter } from './interfaces/errorFormatter'
export type { Resolver } from './interfaces/resolver'
export type { Definitions, DefinitionEntry } from './interfaces/definitions'
export type {
  HandleErrorsOptions,
  ErrorLogger,
  DotEnvPresetOptions,
  YupEnvPresetOptions,
  YupDotEnvPresetOptions,
} from './presets'

export * from './common/confresError'
export { DefinitionEntryType } from './interfaces/definitions'

export * from './dataContainers/basicDataContainer'
export * from './dataContainers/mergedDataContainer'

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
export * from './loaders/env/keyMappers/definitionsBasedKeyMapper'

export * from './validators/validationError'
export * from './validators/yupValidator'

export * from './errorFormatters/textErrorFormatter'
export * from './errorFormatters/chalkErrorFormatter'

export * from './definitions/yup'

import Presets from './presets'
export default Presets
