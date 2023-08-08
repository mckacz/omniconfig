import { FileLoader } from './fileLoader'

/**
 * Loads configuration from JSON file.
 */
export class JsonFileLoader<T = unknown> extends FileLoader<T> {
  /**
   * Creates a new instance of JSON file loader.
   *
   * @param filename A path to JSON file to load.
   * @param section  Section of file to return.
   *
   *  new JsonFileLoader('app.json')                          // load content of app.json
   *  new JsonFileLoader('package.json', 'myApp')             // load section "myApp" from package.json
   *  new JsonFileLoader('package.json', 'custom.myApp')      // load section "custom.myApp" from package.json
   *  new JsonFileLoader('package.json', ['custom', 'myApp']) // load section "custom.myApp" from package.json
   */
  constructor(
    filename: string,
    section?: string | string[]
  ) {
    super(filename, section)
  }

  /**
   * Parse JSON string.
   *
   * @param data JSON string to parse.
   */
  protected parse(data: string): unknown {
    return JSON.parse(data)
  }
}
