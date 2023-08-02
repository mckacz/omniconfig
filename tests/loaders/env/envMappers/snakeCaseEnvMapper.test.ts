import { SnakeCaseEnvMapper } from '~/loaders/env/envMappers/snakeCaseEnvMapper'

describe('SnakeCaseEnvMapper', () => {
  const mapper = new SnakeCaseEnvMapper({
    prefix:    'APP__',
    separator: '__',
  })

  describe('envToPath()', () => {
    test.each([
      ['PATH', undefined],
      ['APP_PATH', undefined],
      ['APP__PATH', ['path']],
      ['APP__SOME_VAR', ['some_var']],
      ['APP__NESTED_OBJ__VAR', ['nested_obj', 'var']],
    ])('Environment variable %s maps to %s', (key, path) => {
      expect(mapper.envToPath(key)).toEqual(path)
    })
  })

  describe('pathToEnv()', () => {
    test.each([
      [['path'], 'APP__PATH'],
      [['some_var'], 'APP__SOME_VAR'],
      [['nested_obj', 'var'], 'APP__NESTED_OBJ__VAR'],
    ])('Path %s maps to %s', (path, key) => {
      expect(mapper.pathToEnv(path)).toEqual(key)
    })
  })
})
