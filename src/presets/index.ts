import { resolve } from './resolve'
import { yupDotEnv, yupEnv } from './yup'

export type { HandleErrorsOptions, ErrorLogger } from './resolve'
export type { DotEnvPresetOptions, YupEnvPresetOptions, YupDotEnvPresetOptions } from './yup'

export default {
  yupEnv,
  yupDotEnv,
  resolve,
}
