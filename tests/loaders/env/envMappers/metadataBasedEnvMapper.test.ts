import { MetadataBasedEnvMapper } from '~/loaders/env/envMappers/metadataBasedEnvMapper'
import { Metadata } from '~/model/metadata'

describe('MetadataBasedEnvMapper', () => {
  const metadata: Metadata[] = [
    { path: ['debug'] },
    { path: ['some', 'nested'] },
    { path: ['someService', 'enabled'] },
    { path: ['someService', 'nested', 'option'] },
  ]

  describe('default options', () => {
    test.each([
      [['debug'], 'DEBUG'],
      [['some', 'nested'], 'SOME_NESTED'],
      [['someService', 'enabled'], 'SOME_SERVICE_ENABLED'],
      [['someService', 'nested', 'option'], 'SOME_SERVICE_NESTED_OPTION'],
      [['notExistingKey'], undefined],
    ])('pathToEnv() maps %p to %p', (path: string[], expectedKey?: string) => {
      expect(
        new MetadataBasedEnvMapper({ metadata: metadata }).pathToEnv(path)
      ).toEqual(expectedKey)
    })

    test.each([
      ['DEBUG',                        ['debug']],
      ['SOME_NESTED',                  ['some', 'nested']],
      ['SOME_SERVICE_ENABLED',         ['someService', 'enabled']],
      ['SOME_SERVICE_NESTED_OPTION',   ['someService', 'nested', 'option']],
      ['SOME_SERVICE__NESTED_OPTION',  undefined],
      ['NOT_EXISTING_KEY',             undefined],
    ])('envToPath() maps %p to %p', (key: string, expectedPath?: string[]) => {
      expect(
        new MetadataBasedEnvMapper({ metadata: metadata }).envToPath(key)
      ).toEqual(expectedPath)
    })
  })

  describe('prefix, different separators', () => {
    test.each([
      [['debug'],                           'APP_DEBUG'],
      [['some', 'nested'],                  'APP_SOME__NESTED'],
      [['someService', 'enabled'],          'APP_SOME_SERVICE__ENABLED'],
      [['someService', 'nested', 'option'], 'APP_SOME_SERVICE__NESTED__OPTION'],
      [['notExistingKey'],                   undefined],
    ])('pathToEnv() maps %p to %p', (path: string[], expectedKey?: string) => {
      expect(
        new MetadataBasedEnvMapper({
          metadata:      metadata,
          prefix:        'APP_',
          separator:     '__',
          wordSeparator: '_',
        }).pathToEnv(path)
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
    ])('envToPath() maps %p to %p', (key: string, expectedPath?: string[]) => {
      expect(
        new MetadataBasedEnvMapper({
          metadata:      metadata,
          prefix:        'APP_',
          separator:     '_',
          wordSeparator: '_',
        }).envToPath(key)
      ).toEqual(expectedPath)
    })
  })
})

