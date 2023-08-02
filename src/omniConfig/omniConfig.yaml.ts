import { loadDependency } from '../common/dependencies'
import { ConfigFileVariantFn, configFileVariantFnFromTemplate, getConfigFileVariants } from '../common/variants'
import { OptionalLoader } from '../loaders/optionalLoader'
import { YamlFileLoader } from '../loaders/yaml/yamlFileLoader'
import type { OmniConfig } from './omniConfig'

export class OmniConfigYaml<TData> {
  /**
   * Load configuration from YAML files.
   *
   * If string is passed, it is considered as a file name template with optional placeholders and directory.
   * Check `configFileVariantFnFromTemplate()` for details.
   *
   * If function is passed, it is used to generate file name variants.
   * Check `getConfigFileVariants()` for defaults.
   *
   * @param template File name template or function resolving the name.
   *
   * @examples
   *  `app.yml                      - Load only `app.yml`.
   *  `app[.local].yml              - Load `app.yml` and `app.local.yml` files.
   *  `config/[node_env].yml[.dist] - Load `config/development.yml.dist` and `config/development.yml` files
   *                                  (assuming `NODE_ENV` is `development`).
   *
   * @see getConfigFileVariants()
   * @see configFileVariantFnFromTemplate()
   */
  useYamlFiles(this: OmniConfig<TData>, template: string | ConfigFileVariantFn): OmniConfig<TData> {
    const load = loadDependency<typeof import('js-yaml')>('js-yaml').load

    let files: string[]

    if (typeof template === 'function') {
      files = getConfigFileVariants(template)
    } else {
      files = getConfigFileVariants(configFileVariantFnFromTemplate(template))
    }

    for (const file of files) {
      this.useLoader(new OptionalLoader(new YamlFileLoader(file, load)))
    }

    return this
  }
}
