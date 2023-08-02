import { SplittingEnvMapper } from '~/loaders/env/envMappers/splittingEnvMapper'

describe('SplittingEnvMapper', () => {
  class JustSplittingKeyMapper extends SplittingEnvMapper {
    protected envToPathPart = (envPart: string): string => envPart
    protected pathToEnvPart = (pathPart: string): string => pathPart
  }

  const defaultConfig = {}

  const customConfig = {
    prefix:    'PREFIX___',
    separator: '___',
  }

  describe('envToPath()', () => {
    test.each([
      [defaultConfig, 'PATH', ['PATH']],
      [defaultConfig, 'PREFIX_PATH', ['PREFIX_PATH']],
      [defaultConfig, 'PREFIX__PATH', ['PREFIX', 'PATH']],
      [defaultConfig, 'FOO__BAR___BAZ', ['FOO', 'BAR', '_BAZ']],

      [customConfig, 'PATH', undefined],
      [customConfig, 'PREFIX__PATH', undefined],
      [customConfig, 'PREFIX___PATH', ['PATH']],
      [customConfig, 'FOO__BAR___BAZ', undefined],
      [customConfig, 'PREFIX___FOO__BAR___BAZ', ['FOO__BAR', 'BAZ']],
    ])('Case %#', (config, key, path) => {
      const mapper = new JustSplittingKeyMapper(config)
      expect(mapper.envToPath(key)).toEqual(path)
    })
  })

  describe('pathToEnv()', () => {
    test.each([
      [defaultConfig, ['PATH'], 'PATH'],
      [defaultConfig, ['FOO', 'BAR', 'BAZ'], 'FOO__BAR__BAZ'],

      [customConfig, ['PATH'], 'PREFIX___PATH'],
      [customConfig, ['FOO', 'BAR', 'BAZ'], 'PREFIX___FOO___BAR___BAZ'],
    ])('Case %#', (config, path, key) => {
      const mapper = new JustSplittingKeyMapper(config)
      expect(mapper.pathToEnv(path)).toEqual(key)
    })
  })
})
