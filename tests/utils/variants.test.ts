import { configFileVariantFnFromTemplate, getConfigFileVariants } from '~/utils/variants'

describe('Configuration file variants util', () => {
  describe('getConfigFileVariants() with template', () => {
    test.each([
      [
        '.env',
        [
          '.env',
        ],
      ],
      [
        '.env[.local]',
        [
          '.env',
          '.env.local',
        ],
      ],
      [
        '.env[.dist]',
        [
          '.env.dist',
          '.env',
        ],
      ],
      [
        '.env[.node_env]',
        [
          '.env',
          '.env.test',
        ],
      ],
      [
        '.env[.node_env][.local]',
        [
          '.env',
          '.env.local',
          '.env.test',
          '.env.test.local',
        ],
      ],
      [
        '.env[.node_env][.dist]',
        [
          '.env.dist',
          '.env',
          '.env.test.dist',
          '.env.test',
        ],
      ],
      [
        'config/[node_env.]app[.local].env',
        [
          'config/app.env',
          'config/app.local.env',
          'config/test.app.env',
          'config/test.app.local.env',
        ],
      ],
    ])(
      'template "%p"',
      (template: string, expectedVariants: string[]) => {
        expect(
          getConfigFileVariants(
            configFileVariantFnFromTemplate(template)
          )
        ).toEqual(expectedVariants)
      }
    )
  })
})
