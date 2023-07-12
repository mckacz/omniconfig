import * as yup from 'yup'
import { YupModel } from '~/model/yup/yupModel'
import { OmniConfig } from '~/omniConfig'

jest.mock('~/model/yup/yupModel')

describe('OmniConfig - Yup integration', () => {
  test('setup Yup model', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('model')

    const schema = yup.object({ foo: yup.string() })
    const options = Symbol() as never

    om.withYup(schema, options)

    expect(om).toHaveProperty('model', expect.any(YupModel))
    expect(YupModel).toBeCalledWith(schema, options)
  })
})
