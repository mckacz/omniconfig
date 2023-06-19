import { CamelCaseKeyMapper } from './camelCaseKeyMapper'

describe('CamelCaseKeyMapper', () => {
  const mapper = new CamelCaseKeyMapper({
    prefix:    'APP__',
    separator: '__',
  })

  describe('keyToPath()', () => {
    test.each([
      ['PATH', undefined],
      ['APP_PATH', undefined],
      ['APP__PATH', ['path']],
      ['APP__SOME_VAR', ['someVar']],
      ['APP__NESTED_OBJ__VAR', ['nestedObj', 'var']],
    ])('Environment variable %s maps to %s', (key, path) => {
      expect(mapper.keyToPath(key)).toEqual(path)
    })
  })

  describe('pathToKey()', () => {
    test.each([
      [['path'], 'APP__PATH'],
      [['someVar'], 'APP__SOME_VAR'],
      [['nestedObj', 'var'], 'APP__NESTED_OBJ__VAR'],
    ])('Path %s maps to %s', (path, key) => {
      expect(mapper.pathToKey(path)).toEqual(key)
    })
  })
})
