import { CamelCaseEnvMapper } from '~/loaders/env/envMappers/camelCaseEnvMapper'

describe('CamelCaseEnvMapper', () => {
  const mapper = new CamelCaseEnvMapper({
    prefix:    'APP__',
    separator: '__',
  })

  describe('envToPath()', () => {
    test.each([
      ['PATH', undefined],
      ['APP_PATH', undefined],
      ['APP__PATH', ['path']],
      ['APP__SOME_VAR', ['someVar']],
      ['APP__NESTED_OBJ__VAR', ['nestedObj', 'var']],
    ])('Environment variable %s maps to %s', (key, path) => {
      expect(mapper.envToPath(key)).toEqual(path)
    })
  })

  describe('pathToEnv()', () => {
    test.each([
      [['path'], 'APP__PATH'],
      [['someVar'], 'APP__SOME_VAR'],
      [['nestedObj', 'var'], 'APP__NESTED_OBJ__VAR'],
    ])('Path %s maps to %s', (path, key) => {
      expect(mapper.pathToEnv(path)).toEqual(key)
    })
  })
})
