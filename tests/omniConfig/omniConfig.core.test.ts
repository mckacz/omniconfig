import { OmniConfig } from '~/omniConfig'
import { OptionalLoader } from '~/loaders/optionalLoader'

jest.mock('~/loaders/optionalLoader')

describe('OmniConfig - Core', () => {
  test('withModel() sets model instance', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('model')

    const model = Symbol() as never
    om.withModel(model)

    expect(om).toHaveProperty('model', model)
  })

  test('useLoader() registers new loaders in order', () => {
    const om = new OmniConfig()
    expect(om).not.toHaveProperty('loaders')

    const loader1 = Symbol('loader1') as never
    const loader2 = Symbol('loader2') as never
    const loader3 = Symbol('loader3') as never

    om.useLoader(loader1)
      .useLoader(loader2)
      .useLoader(loader3)

    expect(om).toHaveProperty('loaders', [loader1, loader2, loader3])
  })

  test('useOptionalLoader() registers new loaders wrapped with OptionalLoader', () => {
    const om = new OmniConfig()
    expect(om).not.toHaveProperty('loaders')

    const loader1 = Symbol('loader1') as never
    const loader2 = Symbol('loader2') as never
    const loader3 = Symbol('loader3') as never

    om.useLoader(loader1)
      .useOptionalLoader(loader2)
      .useLoader(loader3)

    expect(om).toHaveProperty('loaders', [
      loader1,
      expect.any(OptionalLoader),
      loader3
    ])

    expect(OptionalLoader).toHaveBeenCalledWith(loader2)
  })
})
