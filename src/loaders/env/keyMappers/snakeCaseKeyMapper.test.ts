import { SnakeCaseKeyMapper } from './snakeCaseKeyMapper.js'

describe('SnakeCaseKeyMapper', () => {
  const mapper = new SnakeCaseKeyMapper({
    prefix: 'APP__',
    separator: '__',
  })

  describe('keyToPath()', () => {
    test.each([
      ['PATH', undefined],
      ['APP_PATH', undefined],
      ['APP__PATH', 'path'],
      ['APP__SOME_VAR', 'some_var'],
      ['APP__NESTED_OBJ__VAR', 'nested_obj.var'],
    ])('Environment variable %s maps to %s', (key, path) => {
      expect(mapper.keyToPath(key)).toEqual(path)
    })
  })

  describe('pathToKey()', () => {
    test.each([
      ['path', 'APP__PATH'],
      ['some_var', 'APP__SOME_VAR'],
      ['nested_obj.var', 'APP__NESTED_OBJ__VAR'],
    ])('Path %s maps to %s', (path, key) => {
      expect(mapper.pathToKey(path)).toEqual(key)
    })
  })
})
