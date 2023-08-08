import { isAbsolute, join } from 'path'
import { cwd } from 'process'
import { BasicDataContainer } from '../../dataContainers/basicDataContainer'
import { ModuleLoaderError, ModuleLoaderLoadError } from './moduleLoaderError'
import type { Reference } from '../../dataContainers/reference'
import type { Loader } from '../loader'

/**
 * Load module data
 */
interface ModuleData extends Record<string, unknown> {
  __esModule?: unknown
  default?: Record<string, unknown>
}

/**
 * Configuration loader that uses require/import.
 */
export class ModuleLoader<T> implements Loader<T> {
  /**
   * Resolved module path.
   */
  private readonly resolvedPath: string

  /**
   * Creates a new instance of module loader.
   *
   * @param path Module path.
   */
  constructor(
    private readonly path: string,
  ) {
    this.resolvedPath = this.resolveModulePath(path)
  }

  /**
   * Load configuration asynchronously.
   */
  async load(): Promise<BasicDataContainer<T>> {
    try {
      const data = await import(this.resolvedPath) as ModuleData

      return new BasicDataContainer(this, this.normalizeData(data) as T)
    } catch (ex) {
      throw new ModuleLoaderLoadError(this.path, this.resolvedPath, ex)
    }
  }

  /**
   * Load configuration synchronously.
   */
  loadSync(): BasicDataContainer<T> {
    if (typeof require !== 'function') {
      throw new ModuleLoaderError('Cannot load module synchronously - require() not available')
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const data = require(this.resolvedPath) as ModuleData

      return new BasicDataContainer(this, this.normalizeData(data) as T)
    } catch (ex) {
      throw new ModuleLoaderLoadError(this.path, this.resolvedPath, ex)
    }
  }

  /**
   * Returns supported source references for given configuration object path.
   *
   * @param path Object path parts.
   */
  getReferences(path: string[]): Reference[] {
    return [
      {
        source:     this.path,
        identifier: path.join('.'),
      },
    ]
  }

  /**
   * Resolves module path. If given path is relative, it will be prefixed with the current working directory.
   *
   * @param module Module path to resolve.
   */
  private resolveModulePath(module: string): string {
    if (isAbsolute(module)) {
      return module
    }

    return join(cwd(), module)
  }

  /**
   * Normalize loaded data.

   * @param data Data to normalize.
   */
  private normalizeData(data: ModuleData): unknown {
    // transpiled ES module (e.g. TypeScript)
    if (data.__esModule) {
      const onlyDefaultExport = 'default' in data && Object.keys(data).length === 1

      // only default export - use it
      if (onlyDefaultExport) {
        return data.default
      }

      return data
    }

    // TypeScript esModuleInterop handling
    if ('default' in data) {
      const rootKeys    = Object.keys(data)
      const defaultKeys = Object.keys(data?.default ?? {})
      const onlyDefault = rootKeys.length === 1

      const uniqueKeys            = [...new Set([...rootKeys, ...defaultKeys])]
      const defaultKeysSameAsRoot = uniqueKeys.length === defaultKeys.length + 1 // + default

      if (onlyDefault || defaultKeysSameAsRoot) {
        return data.default
      }
    }

    return data
  }
}
