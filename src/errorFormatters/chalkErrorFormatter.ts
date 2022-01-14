import chalk, { ChalkInstance } from 'chalk'
import { ResolverError } from '../resolver/resolverError.js'
import { TextErrorFormatter, TextErrorFormatterView } from './textErrorFormatter.js'

const defaultTemplate = `{{#style.header}}Configuration error:{{/style.header}} {{#style.message}}{{{message}}}{{/style.message}}
{{#isUndefined}}

The value can be defined in:
  {{#hints}}
  - {{#style.container}}{{{container}}}{{/style.container}}{{#identifier}} as {{#style.identifier}}{{{.}}}{{/style.identifier}}{{/identifier}}
  {{/hints}}
{{/isUndefined}}
{{^isUndefined}}{{#cause}}
The causing value is defined in {{#style.container}}{{{container}}}{{/style.container}}{{#identifier}} as {{#style.identifier}}{{{.}}}{{/style.identifier}}{{/identifier}}
{{/cause}}{{/isUndefined}}`

const defaultStyles: Record<string, ChalkInstance> = {
  header:     chalk.bold.redBright,
  message:    chalk.bold,
  container:  chalk.yellow,
  identifier: chalk.italic.cyan,
  code:       chalk.underline,
}

export interface ChalkErrorFormatterView extends TextErrorFormatterView {
  style: Record<string, Function>
}

export class ChalkErrorFormatter extends TextErrorFormatter {
  constructor(
    template = defaultTemplate,
    protected readonly styles = defaultStyles,
  ) {
    super(template)
  }

  format(err: ResolverError | unknown): string | undefined {
    return this.formatCode(super.format(err))
  }

  protected getView(err: ResolverError): ChalkErrorFormatterView {
    const view = super.getView(err)
    const style: Record<string, Function> = {}

    for (const [styleKey, styleFunc] of Object.entries(this.styles)) {
      style[styleKey] = () => (text: string, render: Function) => {
        return styleFunc(render(text))
      }
    }

    return { ...view, style }
  }

  protected formatCode(text: string | undefined): string | undefined {
    if (text && this.styles.code) {
      text = text.replace(
        /`(.*?)`/g,
        (_, value) => this.styles.code(value),
      )
    }

    return text
  }
}
