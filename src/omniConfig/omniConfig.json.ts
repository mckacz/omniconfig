import { ConfigFileVariantFn, configFileVariantFnFromTemplate, getConfigFileVariants } from '../common/variants'
import { JsonFileLoader } from '../loaders/json/jsonFileLoader'
import { OptionalLoader } from '../loaders/optionalLoader'
import type { OmniConfig } from './omniConfig'

export class OmniConfigJson<TData> {
  /**
   * Load configuration from JSON files.
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
   *  `app.json                      - Load only `app.json`.
   *  `app[.local].json              - Load `app.json` and `app.local.json` files.
   *  `config/[node_env].json[.dist] - Load `config/development.json.dist` and `config/development.json` files
   *                                   (assuming `NODE_ENV` is `development`).
   *
   * @see getConfigFileVariants()
   * @see configFileVariantFnFromTemplate()
   */
  useJsonFiles(this: OmniConfig<TData>, template: string | ConfigFileVariantFn): OmniConfig<TData> {
    let files: string[]

    if (typeof template === 'function') {
      files = getConfigFileVariants(template)
    } else {
      files = getConfigFileVariants(configFileVariantFnFromTemplate(template))
    }

    for (const file of files) {
      this.useLoader(new OptionalLoader(new JsonFileLoader(file)))
    }

    return this
  }
}

