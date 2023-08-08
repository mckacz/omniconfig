import { ModuleLoader } from '~/loaders/module/moduleLoader'

describe('ModuleLoader', () => {
  const validCases: Array<[string, unknown]> = [
    ['fixtures/data/valid.js',           { foo: 'js' }],
    ['fixtures/data/valid.default.ts',   { foo: 'ts.default' }],
    ['fixtures/data/valid.noDefault.ts', { foo: 'ts.noDefault' }],
    ['fixtures/data/valid.mixed.ts',     { default: { foo: 'ts.mixed' }, bar: 123 }],
  ]

  describe('load()', () => {
    test.each(validCases)('load "%p" file', async (file: string, expectedData: unknown) => {
      const loader = new ModuleLoader(file)
      const container = await loader.load()

      expect(container.value).toEqual(expectedData)
    })
  })

  describe('loadSync()', () => {
    test.each(validCases)('load "%p" file', (file: string, expectedData: unknown) => {
      const loader = new ModuleLoader(file)
      const container = loader.loadSync()

      expect(container.value).toEqual(expectedData)
    })
  })

  describe('getReference()', () => {
    test('get reference', () => {
      const loader = new ModuleLoader('foo.js')

      expect(loader.getReferences(['bar', 'baz', 'qux'])).toEqual([
        {
          source: 'foo.js',
          identifier: 'bar.baz.qux',
        },
      ])
    })
  })
})
