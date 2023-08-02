import { OmniConfig as OmniConfigClass } from './omniConfig'

export type { Loader } from './interfaces/loader'
export type { Reference } from './interfaces/reference'
export type { Model } from './interfaces/model'
export type { EnvMapper } from './loaders/env/envMappers/envMapper'
export type { ErrorFormatter } from './interfaces/errorFormatter'
export type { Resolver } from './interfaces/resolver'
export type { ValueType, Metadata } from './interfaces/metadata'
export type { ConfigFileVariantFn, ConfigFileVariantContext } from './utils/variants'

export * from './errors/confresError'
export * from './errors/loaderError'
export * from './errors/resolverError'
export * from './errors/validationError'

export * from './dataContainers/basicDataContainer'
export * from './dataContainers/mergedDataContainer'

export * from './resolver/syncResolver'
export * from './resolver/asyncResolver'

export * from './loaders/valueLoader'
export * from './loaders/optionalLoader'

export * from './loaders/json/jsonFileLoader'
export * from './loaders/json/jsonFileLoaderError'

export * from './loaders/yaml/yamlFileLoader'
export * from './loaders/yaml/yamlFileLoaderError'

export * from './loaders/env/envLoader'
export * from './loaders/env/processEnvLoader'
export * from './loaders/env/dotEnvLoader'
export * from './loaders/env/envMappers/splittingEnvMapper'
export * from './loaders/env/envMappers/camelCaseEnvMapper'
export * from './loaders/env/envMappers/snakeCaseEnvMapper'
export * from './loaders/env/envMappers/metadataBasedEnvMapper'

export * from './model/yup/yupModel'
export * from './model/ajv/ajvModel'

export * from './errorFormatters/textErrorFormatter'
export * from './errorFormatters/chalkErrorFormatter'

export * from './omniConfig'

const OmniConfig = new OmniConfigClass()
export default OmniConfig
