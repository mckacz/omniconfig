import { OmniConfig as OmniConfigClass } from './omniConfig'

export type { ConfigFileVariantFn, ConfigFileVariantContext } from './common/variants'
export type { Model } from './model/model'
export type { ValueType, Metadata } from './model/metadata'
export type { Loader } from './loaders/loader'
export type { Resolver } from './resolver/resolver'
export type { Reference } from './dataContainers/reference'
export type { EnvMapper } from './loaders/env/envMappers/envMapper'
export type { ErrorFormatter } from './errorFormatters/errorFormatter'

export * from './common/omniConfigError'

export * from './dataContainers/basicDataContainer'
export * from './dataContainers/mergedDataContainer'

export * from './resolver/resolverError'
export * from './resolver/syncResolver'
export * from './resolver/asyncResolver'

export * from './loaders/loaderError'
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
export * from './model/validationError'

export * from './errorFormatters/textErrorFormatter'
export * from './errorFormatters/chalkErrorFormatter'

export * from './omniConfig'

const OmniConfig = new OmniConfigClass()
export default OmniConfig
