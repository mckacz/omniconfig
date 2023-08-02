/**
 * Context for ConfigFileVariantFn.
 */
export interface ConfigFileVariantContext {
  /**
   * Value of process.env.NODE_ENV to apply.
   */
  nodeEnv?: string

  /**
   * True if function should generate local variant.
   */
  local: boolean

  /**
   * True if function should generate dist variant.
   */
  dist: boolean
}

/**
 * Function that generates config file name for given context.
 */
export interface ConfigFileVariantFn {
  (context: ConfigFileVariantContext): string | undefined
}

/**
 * Create a list of config file names for specified environment.
 *
 * @param fn Function that returns config file name.
 * @param nodeEnv Environment name.
 */
function getConfigFileVariantsForEnv(fn: ConfigFileVariantFn, nodeEnv?: string): (string | undefined)[] {
  return [
    fn({ nodeEnv, dist: true, local: false }),
    fn({ nodeEnv, dist: false, local: false }),
    fn({ nodeEnv, dist: false, local: true }),
  ]
}

/**
 * Returns a list of unique and not empty configuration file names.
 * Uses specified function to create a single variant file name.
 *
 * Configuration files are sorted in the following order:
 *   - generic dist variant
 *   - generic variant
 *   - generic variant local
 *   - environment-specific dist variant
 *   - environment-specific variant
 *   - environment-specific variant local
 *
 * @param fn Function that returns config file name.
 */
export function getConfigFileVariants(fn: ConfigFileVariantFn): string[] {
  const nodeEnv = process.env.NODE_ENV || 'development'

  const files = [
    ...getConfigFileVariantsForEnv(fn),
    ...getConfigFileVariantsForEnv(fn, nodeEnv),
  ]

  const notEmptyFiles = files.filter(file => !!file) as string[]
  const uniqueFiles = [...new Set(notEmptyFiles)]

  return uniqueFiles
}

/**
 * Placeholders used in the template syntax.
 */
enum TemplatePlaceholder {
  Local = 'local',
  Dist = 'dist',
  NodeEnv = 'node_env',
}

/**
 * Create function that generates a variant of config file name using a template.
 *
 * @param template Template with optional placeholders.
 *
 * Placeholder is one of:
 *  `node_env` - replaced with value of `process.env.NODE_ENV` (or `development`)
 *  `dist` - dist file variant (loaded BEFORE the main file)
 *  `local` - local file variant (loaded AFTER the main file)
 *
 *  Each placeholder:
 *    - CAN be prefixed with any character (e.g. `.` or `_`)
 *    - CAN be suffixed with any character (e.g. `.` or `_`)
 *    - MUST be enclosed with square brackets `[]`
 *
 * @examples assuming `process.env.NODE_ENV` is `development
 *
 *  - `.env`                         - for only `.env`
 *  - `.env[.local]`                 - for `.env` and `.env.local`
 *  - `.env[.node_env][.local]`      - for `.env`, `.env.local`, `.env.development` and `.env.development.local`
 *  - `config/[node_env].env[.dist]` - for `config/development.env.dist` and `config/development.env`
 */
export function configFileVariantFnFromTemplate(template: string): ConfigFileVariantFn {
  return ({ nodeEnv, local, dist }) => template.replace(
    /\[(.)?(node_env|local|dist)(.)?\]/g,
    (match: string, prefix: string, placeholder: string, suffix: string) => {
      prefix = prefix ?? ''
      suffix = suffix ?? ''

      if (placeholder === TemplatePlaceholder.Local) {
        return local ? `${prefix}local${suffix}` : ''
      }

      if (placeholder === TemplatePlaceholder.Dist) {
        return dist ? `${prefix}dist${suffix}` : ''
      }

      if (placeholder === TemplatePlaceholder.NodeEnv) {
        return nodeEnv ? `${prefix}${nodeEnv}${suffix}` : ''
      }

      return match
    },
  )
}

