import * as members from '~/exports'

describe('Library exports', () => {
  test('exported members', () => {
    expect(members).toMatchInlineSnapshot(`
{
  "AjvModel": [Function],
  "AsyncResolver": [Function],
  "BasicDataContainer": [Function],
  "CamelCaseKeyMapper": [Function],
  "ChalkErrorFormatter": [Function],
  "ConfresError": [Function],
  "DotEnvLoader": [Function],
  "EnvLoader": [Function],
  "JsonFileLoader": [Function],
  "JsonFileLoaderError": [Function],
  "LoaderError": [Function],
  "MergedDataContainer": [Function],
  "MetadataBasedKeyMapper": [Function],
  "OptionalLoader": [Function],
  "ProcessEnvLoader": [Function],
  "ResolverError": [Function],
  "SnakeCaseKeyMapper": [Function],
  "SplittingKeyMapper": [Function],
  "SyncResolver": [Function],
  "TextErrorFormatter": [Function],
  "TextErrorFormatterPlaceholders": {
    "hint": "hint",
    "identifier": "identifier",
    "message": "message",
    "source": "source",
  },
  "ValidationError": [Function],
  "ValidationErrorType": {
    "0": "generic",
    "1": "invalidValue",
    "2": "undefinedValue",
    "generic": 0,
    "invalidValue": 1,
    "undefinedValue": 2,
  },
  "ValueLoader": [Function],
  "YamlFileLoader": [Function],
  "YamlFileLoaderError": [Function],
  "YupModel": [Function],
}
`)
  })
})
