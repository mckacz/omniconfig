import { ConfigFileVariantFn, configFileVariantFnFromTemplate, getConfigFileVariants } from '../common/variants'
import { ModuleLoader } from '../loaders/module/moduleLoader'
import type { OmniConfig } from './omniConfig'

/**
 * OmniConfig - JS module support.
 */
export class OmniConfigJs<TData> {
  /**
   * Load configuration from JS files.
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
   *  `app.js                      - Load only `app.js`.
   *  `app[.local].js              - Load `app.js` and `app.local.js` files.
   *  `config/[node_env].js[.dist] - Load `config/development.js.dist` and `config/development.js` files
   *                                  (assuming `NODE_ENV` is `development`).
   *
   * @see getConfigFileVariants()
   * @see configFileVariantFnFromTemplate()
   */
  useJsFiles(this: OmniConfig<TData>, template: string | ConfigFileVariantFn): OmniConfig<TData> {
    let files: string[]

    if (typeof template === 'function') {
      files = getConfigFileVariants(template)
    } else {
      files = getConfigFileVariants(configFileVariantFnFromTemplate(template))
    }

    for (const file of files) {
      this.useOptionalLoader(new ModuleLoader(file))
    }

    return this
  }
}
