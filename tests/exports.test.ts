import * as members from '~/exports'

describe('Library exports', () => {
  test('exported members', () => {
    expect(members).toMatchInlineSnapshot(`
Object {
  "AsyncResolver": [Function],
  "CamelCaseKeyMapper": [Function],
  "ChalkErrorFormatter": [Function],
  "ConfresError": [Function],
  "DotEnvLoader": [Function],
  "EnvLoader": [Function],
  "JsonFileLoader": [Function],
  "JsonFileLoaderError": [Function],
  "LoaderError": [Function],
  "OptionalLoader": [Function],
  "ProcessEnvLoader": [Function],
  "ProcessorError": [Function],
  "ProcessorErrorType": Object {
    "0": "generic",
    "1": "invalidValue",
    "2": "undefinedValue",
    "generic": 0,
    "invalidValue": 1,
    "undefinedValue": 2,
  },
  "ResolverError": [Function],
  "SnakeCaseKeyMapper": [Function],
  "SplittingKeyMapper": [Function],
  "SyncResolver": [Function],
  "TextErrorFormatter": [Function],
  "TextErrorFormatterPlaceholders": Object {
    "hint": "hint",
    "identifier": "identifier",
    "message": "message",
    "source": "source",
  },
  "ValueLoader": [Function],
  "YupProcessor": [Function],
  "default": Object {
    "resolve": [Function],
    "yupDotEnv": [Function],
    "yupDotEnvSync": [Function],
    "yupEnv": [Function],
    "yupEnvSync": [Function],
  },
}
`)
  })
})
