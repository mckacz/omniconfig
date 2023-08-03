import { YupModel } from '../model/yup/yupModel'
import type { OmniConfig } from './omniConfig'
import type { Asserts, ObjectSchema, ValidateOptions } from 'yup'

/**
 * OmniConfig - Yup integration.
 */
export class OmniConfigYup<TData> {
  /**
   * Set Yup object schema as a validation model.
   *
   * @param schema Yup object schema.
   * @param options Yup validation options.
   */
  withYup<TSchema extends ObjectSchema<any>>(
    this: OmniConfig<TData>,
    schema: TSchema,
    options?: ValidateOptions
  ): OmniConfig<Asserts<TSchema>> {
    const that = this as OmniConfig<Asserts<TSchema>>
    that.model = new YupModel(schema, options)

    return that
  }
}
