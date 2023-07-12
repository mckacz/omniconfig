import type { Asserts, ObjectSchema, ValidateOptions } from 'yup'
import type { OmniConfig } from './omniConfig'
import { YupModel } from '../model/yup/yupModel'

export class OmniConfigYup<TData> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
