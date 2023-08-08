import { ConfigFileVariantFn, configFileVariantFnFromTemplate, getConfigFileVariants } from '../common/variants'
import { JsonFileLoader } from '../loaders/file/jsonFileLoader'
import type { OmniConfig } from './omniConfig'

export interface OmniConfigFileOptions {
  /**
   * File name template or function resolving the name.
   *
   * If string is passed, it is considered as a file name template with optional placeholders and directory.
   * Check `configFileVariantFnFromTemplate()` for details.
   *
   * If function is passed, it is used to generate file name variants.
   * Check `getConfigFileVariants()` for defaults.
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
  template: string | ConfigFileVariantFn

  /**
   * Optional section of the file to load.
   *
   * @examples
   *
   *  undefined // load whole file content
   *
   *  "foo"    // or
   *  ["foo"]  // load only "foo" key from the file
   *
   *  "foo.bar"       // or
   *  ["foo", "bar"]  // load only "bar" key nested in "foo" key from the file
   */
  section?: string | string[]
}

/**
 * OmniConfig - JSON file support.
 */
export class OmniConfigJson<TData> {
  /**
   * Loads configuration from JSON files.
   *
   * @param templateOrOptions File name template or file options.
   *
   * @see OmniConfigFileOptions
   */
  useJsonFiles(
    this: OmniConfig<TData>,
    templateOrOptions: string | ConfigFileVariantFn | OmniConfigFileOptions
  ): OmniConfig<TData> {
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
      this.useOptionalLoader(new JsonFileLoader(file, section))
    }

    return this
  }
}

