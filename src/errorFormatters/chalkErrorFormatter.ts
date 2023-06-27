import _ from 'lodash'
import type { Chalk } from 'chalk'
import type { MembersOfType, RecordWithSuffix } from '../utils/helpers'
import { TextErrorFormatter, TextErrorFormatterPlaceholders, TextErrorFormatterTemplates } from './textErrorFormatter'

/**
 * Type helper - array of chalk's method call chain.
 */
type ChalkStylePath = Array<keyof MembersOfType<Chalk, Chalk>>

/**
 * Type helper - chalk's method call chain or chalk instance.
 */
type ChalkStylePathOrInstance = ChalkStylePath | Chalk

/**
 * Type helper - key of ChalkErrorFormatterTheme
 */
type ChalkErrorFormatterStyleKey = keyof ChalkErrorFormatterTheme

/**
 * Theme for ChalkErrorFormatter.
 *
 * Keys are:
 *  - TextErrorFormatterPlaceholders keys - styles for the placeholders
 *  - TextErrorFormatterTemplates keys with `Template` suffix - styles for message templates
 *  - `code` - additional style for code fragments between backticks in error message
 *
 *  Values are chalk's method call chain path or chalk instance itself.
 */
export interface ChalkErrorFormatterTheme extends Partial<RecordWithSuffix<TextErrorFormatterTemplates, ChalkStylePathOrInstance, 'Template'>>,
  Partial<Record<TextErrorFormatterPlaceholders, ChalkStylePathOrInstance>> {
  code?: ChalkStylePathOrInstance
}

/**
 * ChalkErrorFormatter options.
 */
export interface ChalkErrorFormatterOptions {
  /**
   * Chalk instance to use.
   */
  chalk: Chalk

  /**
   * Theme for the instance.
   */
  theme?: ChalkErrorFormatterTheme

  /**
   * Message templates to use.
   */
  templates?: Partial<TextErrorFormatterTemplates>
}

/**
 * Formats ResolverError as human-readable plain text message with applied terminal styles using chalk.
 */
export class ChalkErrorFormatter extends TextErrorFormatter {
  /**
   * Default styling theme.
   */
  static readonly defaultTheme: ChalkErrorFormatterTheme = {
    headerTemplate: ['red'],
    message:        ['reset'],
    identifier:     ['cyan', 'italic'],
    source:         ['yellow', 'italic'],
    code:           ['greenBright', 'italic'],
  }

  /**
   * Chalk instance to use.
   */
  private readonly chalk: Chalk

  /**
   * Styling theme.
   */
  private readonly theme: ChalkErrorFormatterTheme

  /**
   * Creates a new instance or ChalkErrorFormatter.
   *
   * @param options Formatter options.
   */
  constructor(options: ChalkErrorFormatterOptions) {
    super(options.templates)

    this.chalk = options.chalk
    this.theme = options.theme ?? ChalkErrorFormatter.defaultTheme
  }

  /**
   * Decorates `renderTemplate()` from `TextErrorFormatter` to apply styles.
   *
   * @param templateKey Template key.
   * @param dictionary Dictionary with placeholder replacements.
   */
  protected renderTemplate(templateKey: keyof TextErrorFormatterTemplates, dictionary: Record<string, string> = {}): string {
    const templateStyleKey = `${templateKey}Template` as ChalkErrorFormatterStyleKey

    for (const placeholder of Object.keys(dictionary)) {
      dictionary[placeholder] = this.applyStyle(placeholder as ChalkErrorFormatterStyleKey, dictionary[placeholder])
    }

    return this.formatCode(
      this.applyStyle(
        templateStyleKey,
        super.renderTemplate(templateKey, dictionary),
      ),
    )
  }

  /**
   * Formats code blocks in error message.
   *
   * @param text Text to format code blocks in.
   */
  private formatCode(text: string): string {
    return text.replace(
      /`(.*?)`/g,
      (_, value: string) => this.applyStyle('code', value),
    )
  }

  /**
   * Applies style represented by given style key to the passed text.
   *
   * @param styleKey Style key.
   * @param text Text to apply style to.
   */
  private applyStyle(styleKey: ChalkErrorFormatterStyleKey, text: string): string {
    const styleOrPath = this.theme[styleKey]

    if (styleOrPath) {
      let style: Chalk | unknown

      if (styleOrPath instanceof Array) {
        style = _.get(this.chalk, styleOrPath)
      } else {
        style = styleOrPath
      }

      if (ChalkErrorFormatter.isChalkInstance(style)) {
        text = style(text)
      }
    }

    return text
  }

  /**
   * Type guard that checks if passed value is chalk instance.
   * Is needed to check because chalk is optional dependency of this library
   * and the user must pass the chalk instance to the constructor.
   *
   * @param subject Thing to check if it is a ChalkInstance.
   */
  private static isChalkInstance(subject: Chalk | unknown): subject is Chalk {
    return typeof subject === 'function' && 'reset' in subject
  }
}
