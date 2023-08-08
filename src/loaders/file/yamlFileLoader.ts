import { FileLoader } from './fileLoader'

/**
 * Loads configuration from YAML file.
 */
export class YamlFileLoader<T = unknown> extends FileLoader<T> {
  /**
   * Creates a new instance of YAML file loader.
   *
   * @param jsYamlLoad load() function from "js-yaml"
   * @param filename A path to YAML file to load.
   * @param section  Section of file to return.
   *
   *  new YamlFileLoader('app.yml', jsYaml)                          // load content of app.yml
   *  new YamlFileLoader('package.yml', jsYaml, 'myApp')             // load section "myApp" from package.yml
   *  new YamlFileLoader('package.yml', jsYaml, 'custom.myApp')      // load section "custom.myApp" from package.yml
   *  new YamlFileLoader('package.yml', jsYaml, ['custom', 'myApp']) // load section "custom.myApp" from package.yml
   */
  constructor(
    protected readonly jsYamlLoad: typeof import('js-yaml')['load'],
    filename: string,
    section?: string | string[],
  ) {
    super(filename, section)
  }

  /**
   * Parse YAML string into object.
   *
   * @param data YAML string to parse.
   */
  protected parse(data: string): unknown {
    return this.jsYamlLoad(data)
  }
}
