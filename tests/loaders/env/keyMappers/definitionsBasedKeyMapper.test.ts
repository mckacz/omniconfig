import { Definitions } from '~/interfaces/definitions'
import { DefinitionsBasedKeyMapper } from '~/loaders/env/keyMappers/definitionsBasedKeyMapper'

describe('DefinitionsBasedKeyMapper', () => {
  const definitions: Definitions = [
    {path: ['debug']},
    {path: ['some', 'nested']},
    {path: ['someService', 'enabled']},
    {path: ['someService', 'nested', 'option']},
  ]

  describe('default options', () => {
    test.each([
      [['debug'], 'DEBUG'],
      [['some', 'nested'], 'SOME__NESTED'],
      [['someService', 'enabled'], 'SOME_SERVICE__ENABLED'],
      [['someService', 'nested', 'option'], 'SOME_SERVICE__NESTED__OPTION'],
      [['notExistingKey'], undefined],
    ])('pathToKey() maps %p to %p', (path: string[], expectedKey?: string) => {
      expect(
        new DefinitionsBasedKeyMapper({definitions}).pathToKey(path)
      ).toEqual(expectedKey)
    })

    test.each([
      ['DEBUG',                        ['debug']],
      ['SOME__NESTED',                 ['some', 'nested']],
      ['SOME_SERVICE__ENABLED',        ['someService', 'enabled']],
      ['SOME_SERVICE__NESTED__OPTION', ['someService', 'nested', 'option']],
      ['SOME_SERVICE_NESTED_OPTION',   undefined],
      ['NOT_EXISTING_KEY',             undefined],
    ])('keyToPath() maps %p to %p', (key: string, expectedPath?: string[]) => {
      expect(
        new DefinitionsBasedKeyMapper({definitions}).keyToPath(key)
      ).toEqual(expectedPath)
    })
  })

  describe('prefix, different separators', () => {
    test.each([
      [['debug'], 'APP_DEBUG'],
      [['some', 'nested'], 'APP_SOME_NESTED'],
      [['someService', 'enabled'], 'APP_SOME_SERVICE_ENABLED'],
      [['someService', 'nested', 'option'], 'APP_SOME_SERVICE_NESTED_OPTION'],
      [['notExistingKey'], undefined],
    ])('pathToKey() maps %p to %p', (path: string[], expectedKey?: string) => {
      expect(
        new DefinitionsBasedKeyMapper({
          definitions,
          prefix:        'APP_',
          separator:     '_',
          wordSeparator: '_'
        }).pathToKey(path)
      ).toEqual(expectedKey)
    })

    test.each([
      ['APP_DEBUG',                        ['debug']],
      ['APP_SOME_NESTED',                  ['some', 'nested']],
      ['APP_SOME_SERVICE_ENABLED',         ['someService', 'enabled']],
      ['APP_SOME_SERVICE_NESTED_OPTION',   ['someService', 'nested', 'option']],
      ['SOME_SERVICE_NESTED_OPTION',       undefined],
      ['APP__SOME_SERVICE__NESTED_OPTION', undefined],
      ['APP_NOT_EXISTING_KEY',             undefined],
    ])('keyToPath() maps %p to %p', (key: string, expectedPath?: string[]) => {
      expect(
        new DefinitionsBasedKeyMapper({
          definitions,
          prefix:        'APP_',
          separator:     '_',
          wordSeparator: '_'
        }).keyToPath(key)
      ).toEqual(expectedPath)
    })
  })
})

