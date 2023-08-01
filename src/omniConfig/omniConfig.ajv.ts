import { AjvModel } from '../model/ajv/ajvModel'
import { loadDependency } from '../utils/dependencies'
import type { OmniConfig } from './omniConfig'
import type { AnySchemaObject, JSONSchemaType, Options } from 'ajv'
import type { JTDOptions } from 'ajv/dist/jtd'
import type { AnyValidateFunction, DataValidationCxt } from 'ajv/dist/types'
import type { JTDDataType, SomeJTDSchemaType } from 'ajv/lib/types/jtd-schema'

/**
 * OmniConfig - Ajv integration
 */
export class OmniConfigAjv<TData> {
  /**
   * Sets JSON schema as a validation model.
   *
   * @param schema JSON schema.
   * @param options Ajv options.
   * @param context Ajv data validation context.
   */
  withJsonSchema<TSchemaData>(
    this: OmniConfig<TData>,
    schema: JSONSchemaType<TSchemaData>,
    options?: Options,
    context?: DataValidationCxt
  ): OmniConfig<TSchemaData> {
    const fn = this.compileJsonSchema(schema, options)

    const that: OmniConfig<TSchemaData> = <never> this
    that.model = new AjvModel(fn, context)

    return that
  }

  /**
   * Sets JDT schema as a validation model.
   *
   * @param schema JDT schema.
   * @param options Ajv JDT options.
   * @param context Ajv data validation context.
   */
  withJTDSchema<JDTSchema, JDTData = JTDDataType<JDTSchema>>(
    this: OmniConfig<TData>,
    schema: JDTSchema,
    options?: JTDOptions,
    context?: DataValidationCxt
  ): OmniConfig<JDTData> {
    const fn = this.compileJTDSchema(schema as SomeJTDSchemaType, options)

    const that: OmniConfig<JDTData> = <never> this
    that.model = new AjvModel(fn, context)

    return that
  }

  /**
   * Compiles JSON schema as validation function.
   *
   * @param schema JSON schema.
   * @param options Ajv options.
   */
  private compileJsonSchema(schema: AnySchemaObject, options?: Options): AnyValidateFunction {
    const Ajv = loadDependency<typeof import('ajv')>('ajv').default

    const ajv = new Ajv({
      coerceTypes:      true,
      useDefaults:      true,
      removeAdditional: true,
      ...options,
    })

    return ajv.compile(schema)
  }

  /**
   * Compiles JDT schema as validation function.
   *
   * @param schema JDT schema.
   * @param options Ajv JDT options.
   */
  private compileJTDSchema(schema: SomeJTDSchemaType, options?: JTDOptions): AnyValidateFunction {
    const Ajv = loadDependency<typeof import('ajv/dist/jtd')>('ajv/dist/jtd').default

    const ajv = new Ajv({
      removeAdditional: true,
      ...options,
    })

    return ajv.compile(<never>schema, true)
  }
}
