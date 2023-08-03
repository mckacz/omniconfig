import * as members from '~/exports'

describe('Library exports', () => {
  test('exported members', () => {
    expect(members).toMatchInlineSnapshot(`
{
  "AjvModel": [Function],
  "AsyncResolver": [Function],
  "BasicDataContainer": [Function],
  "CamelCaseEnvMapper": [Function],
  "ChalkErrorFormatter": [Function],
  "DotEnvLoader": [Function],
  "EnvLoader": [Function],
  "JsonFileLoader": [Function],
  "JsonFileLoaderError": [Function],
  "LoaderError": [Function],
  "MergedDataContainer": [Function],
  "MetadataBasedEnvMapper": [Function],
  "OmniConfig": [Function],
  "OmniConfigError": [Function],
  "OptionalLoader": [Function],
  "ProcessEnvLoader": [Function],
  "ResolverError": [Function],
  "SnakeCaseEnvMapper": [Function],
  "SplittingEnvMapper": [Function],
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
  "default": OmniConfigResolve {},
}
`)
  })
})
