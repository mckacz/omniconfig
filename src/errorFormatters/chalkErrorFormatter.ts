import _ from 'lodash'
import type { ChalkInstance } from 'chalk'
import type { DeepPartial, MembersOfType, RecordWithSuffix } from '../helpers.js'
import {
  TextErrorFormatter,
  TextErrorFormatterOptions,
  TextErrorFormatterPlaceholders,
  TextErrorFormatterTemplates,
} from './textErrorFormatter.js'

type ChalkStylePath = Array<keyof MembersOfType<ChalkInstance, ChalkInstance>>

export interface ChalkErrorFormatterStyles extends Partial<RecordWithSuffix<TextErrorFormatterTemplates, ChalkStylePath, 'Template'>>,
  Partial<Record<TextErrorFormatterPlaceholders, ChalkStylePath>> {
  code?: ChalkStylePath
}

export type ChalkErrorFormatterStyleKey = keyof ChalkErrorFormatterStyles

const defaultStyles: ChalkErrorFormatterStyles = {
  // headerTemplate: chalk.bold.redBright,
  // message: chalk.yellow,
  // container:      chalk.yellow,
  // code:           chalk.underline,

  identifier: ['cyan', 'italic'],

}


export interface ChalkErrorFormatterOptions extends DeepPartial<TextErrorFormatterOptions> {
  chalk: ChalkInstance
  styles?: DeepPartial<ChalkErrorFormatterStyles>
}

export class ChalkErrorFormatter extends TextErrorFormatter {
  private readonly chalk: ChalkInstance
  private readonly styles: ChalkErrorFormatterStyles

  constructor(options: ChalkErrorFormatterOptions) {
    super(options)

    this.chalk = options.chalk
    this.styles = _.merge({}, defaultStyles, options.styles)
  }

  protected renderTemplate(template: string, dictionary: Record<string, string>): string {
    const templateStyleKey = `${template}Template` as ChalkErrorFormatterStyleKey

    for (const placeholder of Object.keys(dictionary)) {
      dictionary[placeholder] = this.applyStyle(placeholder as ChalkErrorFormatterStyleKey, dictionary[placeholder])
    }

    return this.formatCode(
      this.applyStyle(
        templateStyleKey,
        super.renderTemplate(template, dictionary),
      ),
    )
  }

  private formatCode(text: string): string {
    return text.replace(
      /`(.*?)`/g,
      (_, value: string) => this.applyStyle('code', value),
    )
  }

  private applyStyle(styleKey: ChalkErrorFormatterStyleKey, text: string): string {
    if (this.styles[styleKey]) {
      const style: unknown = _.get(this.chalk, this.styles[styleKey] as ChalkStylePath)

      if (this.isChalkInstance(style)) {
        text = style(text)
      }
    }

    return text
  }

  private isChalkInstance(subject: ChalkInstance | unknown): subject is ChalkInstance {
    return typeof subject === 'function' && 'reset' in subject
  }
}
