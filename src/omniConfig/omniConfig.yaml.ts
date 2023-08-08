import { loadDependency } from '../common/dependencies'
import { ConfigFileVariantFn, configFileVariantFnFromTemplate, getConfigFileVariants } from '../common/variants'
import { YamlFileLoader } from '../loaders/file/yamlFileLoader'
import type { OmniConfig } from './omniConfig'
import type { OmniConfigFileOptions } from './omniConfig.json'

/**
 * OmniConfig - YAML file support.
 */
export class OmniConfigYaml<TData> {
  /**
   * Load configuration from YAML files.
   *
   * @param templateOrOptions File name template or file options.
   *
   * @see OmniConfigFileOptions
   */
  useYamlFiles(
    this: OmniConfig<TData>,
    templateOrOptions: string | ConfigFileVariantFn | OmniConfigFileOptions,
  ): OmniConfig<TData> {
    const load = loadDependency<typeof import('js-yaml')>('js-yaml').load

    let template: string | ConfigFileVariantFn
    let section: string | string[] | undefined

    if (typeof templateOrOptions === 'object') {
      template = templateOrOptions.template
      section = templateOrOptions.section
    } else {
      template = templateOrOptions
    }

    let files: string[]

    if (typeof template === 'function') {
      files = getConfigFileVariants(template)
    } else {
      files = getConfigFileVariants(configFileVariantFnFromTemplate(template))
    }

    for (const file of files) {
      this.useOptionalLoader(new YamlFileLoader(load, file, section))
    }

    return this
  }
}
