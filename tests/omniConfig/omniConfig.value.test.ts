import { OmniConfig } from '~/omniConfig'

describe('OmniConfig - static value', () => {
  test('add loader with given value', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useValue({
      myValue: 123,
    })

    expect(om).toHaveProperty('loaders', [
      expect.objectContaining({
        source: expect.any(String),

        value: {
          myValue: 123,
        },
      }),
    ])
  })

  test('add loader with given value and custom source name', () => {
    const om = new OmniConfig()

    expect(om).not.toHaveProperty('loaders')

    om.useValue(
      {
        myValue: 123,
      },
      'Custom options'
    )

    expect(om).toHaveProperty('loaders', [
      expect.objectContaining({
        source: 'Custom options',

        value: {
          myValue: 123,
        },
      }),
    ])
  })
})
