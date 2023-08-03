# OmniConfig

OmniConfig is a universal runtime configuration loader and validator.  
Define schema and configuration sources. Use merged and valid configuration object for your application. 

**Key features:**

* load, normalize and merge configuration from multiple sources (environment variables, .env files, JSON files, YAML files)
* validate configuration object using [Yup](https://github.com/jquense/yup) or JSON/JTD schema (through [Ajv](https://github.com/ajv-validator/ajv))
* get meaningful error messages
  * for invalid values: where the value comes from
  * for missing values: how the value can be defined
  * optionally display a pretty error message
* leverage TypeScript support including type inference from the schema
* extend the library and use your own loader or validator 
* minimal footprint - only install dependencies that you need

## Example

Load and merge configuration (in order) from `.env`, `.env.local` and `process.env`.  
Use `APP_` prefix for environment variables. Validate merged object using Yup.

```ts
import * as yup from 'yup'
import OmniConfig from 'omniconfig'

const config = OmniConfig
  .withYup(yup.object({/*...*/}))
  .useEnvironmentVariables({
    processEnv: true,
    envMapper:  { prefix: 'APP_' },
    dotEnv:     '.env[.local]',
  })
  .resolveSync()

console.log(config)
```

Get normalized and merged config object - like this:

```json5
{
  db: { host: 'localhost', port: 5432, user: 'some_user', pass: 'foo' },
  debug: true
}
```

...or meaningful error messages:

_Missing value:_
<pre>
<strong>Configuration error:</strong> db.user is a required field
The value can be defined in:
  - <strong><i>.env</i></strong> as <strong><i>APP_DB_USER</i></strong>
  - <strong><i>.env.local</i></strong> as <strong><i>APP_DB_USER</i></strong>
  - <strong>Environment variables</strong> as <strong><i>APP_DB_USER</i></strong>
</pre>


_Invalid value:_
<pre>
<strong>Configuration error:</strong> db.port must be greater than or equal to 0
The causing value is defined in <strong><i>.env.local</i></strong> as <strong><i>APP_DB_PORT</i></strong>
</pre>

Check [full code](./examples/yup-dotenv-process-env) of this example.  
You can find more examples in [examples](./examples) directory.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Installation](#installation)
- [High level API](#high-level-api)
  - [OmniConfig](#omniconfig)
  - [`.withModel(model?: Model): OmniConfig`](#withmodelmodel-model-omniconfig)
  - [`.useLoader(loader: Loader): OmniConfig`](#useloaderloader-loader-omniconfig)
  - [`.useOptionalLoader(loader: Loader): OmniConfig`](#useoptionalloaderloader-loader-omniconfig)
  - [`.withYup(schema: yup.ObjectSchema, options?: yup.ValidateOptions): OmniConfig`](#withyupschema-yupobjectschema-options-yupvalidateoptions-omniconfig)
  - [`.withJsonSchema(schema: ajv.JSONSchemaType, options?: ajv.Options, context?: ajv.DataValidationCxt): OmniConfig`](#withjsonschemaschema-ajvjsonschematype-options-ajvoptions-context-ajvdatavalidationcxt-omniconfig)
  - [`.withJTDSchema(schema: ajv.JDTSchema, options?: ajv.JTDOptions, context?: ajv.DataValidationCxt): OmniConfig`](#withjtdschemaschema-ajvjdtschema-options-ajvjtdoptions-context-ajvdatavalidationcxt-omniconfig)
  - [`.useEnvironmentVariables(options?: OmniConfigEnvOptions): OmniConfig`](#useenvironmentvariablesoptions-omniconfigenvoptions-omniconfig)
    - [Options](#options)
      - [`processEnv: boolean = true`](#processenv-boolean--true)
      - [`dotEnv: true | string | ConfigFileVariantFn`](#dotenv-true--string--configfilevariantfn)
      - [`envMapper: EnvMapper | Partial<MetadataBasedEnvMapperOptions>`](#envmapper-envmapper--partialmetadatabasedenvmapperoptions)
  - [`.useJsonFiles(template: string | ConfigFileVariantFn): OmniConfig`](#usejsonfilestemplate-string--configfilevariantfn-omniconfig)
  - [`.useYamlFiles(template: string | ConfigFileVariantFn): OmniConfig`](#useyamlfilestemplate-string--configfilevariantfn-omniconfig)
  - [`.resolve(options?: OmniConfigResolveOptions): Promise<Config>`](#resolveoptions-omniconfigresolveoptions-promiseconfig)
    - [Options](#options-1)
      - [`logger: OmniConfigResolveErrorLogger`](#logger-omniconfigresolveerrorlogger)
      - [`formatter: ErrorFormatter`](#formatter-errorformatter)
      - [`exitCode: number`](#exitcode-number)
  - [`.resolveSync(options?: OmniConfigResolveOptions): Config`](#resolvesyncoptions-omniconfigresolveoptions-config)
- [File name template syntax](#file-name-template-syntax)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```shell
npm i omniconfig --save   # this library

npm i dotenv --save       # optional .env file support 
npm i js-yaml --save      # optional YAML file support 
npm i yup --save          # optional Yup support 
npm i ajv --save          # optional JSON schema and JDT schema support 
npm i chalk@^4.1.2 --save # optional error message coloring 
```

or 

```shell
yarn add omniconfig   # this library

yarn add dotenv       # optional .env file support 
yarn add js-yaml      # optional YAML file support 
yarn add yup          # optional Yup support 
yarn add ajv          # optional JSON schema and JDT schema support 
yarn add chalk@^4.1.2 # optional error message coloring 
```

## High level API

### OmniConfig

High level class with builder-like API.

```ts
import { OmniConfig } from 'omniconfig'

const config = new OmniConfig()
  .withModel(/*...*/)
  .useLoader(/*...*/)
  .useLoader(/*...*/)
  // ...
```

Ready-to-use instance if also exported using a default export.

```ts
import OmniConfig from 'omniconfig'

const config = OmniConfig
  .withModel(/*...*/)
  .useLoader(/*...*/)
  .useLoader(/*...*/)
  // ...
```

### `.withModel(model?: Model): OmniConfig`

Set model to validate configuration against. If model is not set, validation will not be performed.
You can use one of built-in models like [YupModel](src/model/yup/yupModel.ts) 
or [AjvModel](src/model/ajv/ajvModel.ts) or create a custom one. Check the [Model](src/model/model.ts) interface 
for the details.

### `.useLoader(loader: Loader): OmniConfig`

Adds new loader to the end of loader list. Values loaded with it overwrite the previously loaded values. 

Built-in loaders:
* [ProcessEnvLoader](src/loaders/env/processEnvLoader.ts) - loads process environment variables
* [DotEnvLoader](src/loaders/env/dotEnvLoader.ts) - loads environment variables .env files (requires [dotenv](https://github.com/motdotla/dotenv))
* [JsonFileLoader](src/loaders/json/jsonFileLoader.ts) - loads JSON files
* [YamlFileLoader](src/loaders/yaml/yamlFileLoader.ts) - loads YAML files (requires [js-yaml](https://github.com/nodeca/js-yaml))
* [OptionalLoader](src/loaders/optionalLoader.ts) - loader wrapper that ignores errors thrown by inner loader

### `.useOptionalLoader(loader: Loader): OmniConfig`

Adds new optional loader to the end of loader list. Values loaded with it overwrite the previously loaded values.

### `.withYup(schema: yup.ObjectSchema, options?: yup.ValidateOptions): OmniConfig`

> Required dependency: [Yup](https://github.com/jquense/yup)

Sets Yup object schema as a validation model. Dynamic schemas are not supported.

```ts
import * as yup from 'yup'
import OmniConfig from 'omniconfig'

const schema = yup.object({
  debug: yup.boolean().default(false),

  db: yup.object({
    host: yup.string().required(),
    port: yup.number().min(0).default(5432),
    user: yup.string().required(),
    pass: yup.string()
  })
})

const config = OmniConfig
  .withYup(schema)
 // ...
```

### `.withJsonSchema(schema: ajv.JSONSchemaType, options?: ajv.Options, context?: ajv.DataValidationCxt): OmniConfig`

> Required dependency: [Ajv](https://github.com/ajv-validator/ajv)

Sets JSON schema as a validation model. Using following default options for Ajv:

```json5
{
  coerceTypes: true,
  useDefaults: true,
  removeAdditional: true,
}
```

Example that uses Ajv default JSON schema version:

```ts
import OmniConfig from 'omniconfig'

interface Config {
  debug: boolean
  db: {
    host: string
    port: number
    user: string
    pass?: string
  }
}

const config = OmniConfig
  .withJsonSchema<Config>({
    type:     'object',
    required: ['db'],

    properties: {
      debug: {
        type:    'boolean',
        default: false,
      },

      db: {
        type:     'object',
        required: ['host', 'user', 'port'],

        properties: {
          host: { type: 'string' },
          port: { type: 'number', default: 5432 },
          user: { type: 'string' },
          pass: { type: 'string', nullable: true },
        }
      }
    }
  })
```

You can also customize Ajv behaviour (change schema, add keywords, etc...):

```ts
import Ajv from 'ajv'
import OmniConfig from 'omniconfig'
import { AjvModel } from './ajvModel'

const ajv = new Ajv({
  // your options
})

ajv.addSchema(/*...*/)
ajv.addFormat(/*...*/)
ajv.addKeyword(/*...*/)

const customFn = ajv.compile({
  // your schema
})

const config = OmniConfig
  .withModel(new AjvModel({ fn: customFn }))
```

### `.withJTDSchema(schema: ajv.JDTSchema, options?: ajv.JTDOptions, context?: ajv.DataValidationCxt): OmniConfig`

> Required dependency: [Ajv](https://github.com/ajv-validator/ajv)

Sets JTD schema as a validation model.

### `.useEnvironmentVariables(options?: OmniConfigEnvOptions): OmniConfig`

Load configuration from environment variables and optionally .env files.

#### Options

Default options:

```json5
{
  processEnv: true,

  // MetadataBasedEnvMapperOptions
  envMapper: {
    prefix:        '',
    separator:     '_',
    wordSeparator: '_',
  }
}
```

##### `processEnv: boolean = true`

Enables (default) or disables loading configuration from process environment variables (`process.env).
When enables, this loader is always added after .env files, so process environment variables always overwrite 
variables from .env files. 

```ts
import OmniConfig from 'omniconfig'

const config = OmniConfig
  //...
  .useEnvironmentVariables({ processEnv: true }) // same as .useEnvironmentVariables()
  //...
```

##### `dotEnv: true | string | ConfigFileVariantFn` 

> Required dependency: [dotenv](https://github.com/motdotla/dotenv)

Enable loading of .env files. Supports following value:

* `true` - load only `.env` file from current working directory
* `string` - file name template for .env files ([syntax](#file-name-template-syntax))
* `ConfigFileVariantFn` - function returns path to file for given [context](src/common/variants.ts#L4)

```ts
import OmniConfig from 'omniconfig'

const config = OmniConfig
  //...
  .useEnvironmentVariables({
    dotenv: '.env[.local]'
    // dotenv: true
    // dotenv: ({ local, dist, nodeEnv }) => local ? '.env.very-custom-local-name' : `.env`
  })
//...
```

##### `envMapper: EnvMapper | Partial<MetadataBasedEnvMapperOptions>`

Accepts environment variable mapper instance or options for [MetadataBasedEnvMapper](src/loaders/env/envMappers/metadataBasedEnvMapper.ts).

By default, [MetadataBasedEnvMapper](src/loaders/env/envMappers/metadataBasedEnvMapper.ts) is used. This mapper
leverages metadata generated from the model (both Yup and Ajv support it) to map environment variables to configuration
object keys. This approach allows to use same separator for configuration levels and camelcase names.

```ts
import * as yup from 'yup'
import OmniConfig from 'omniconfig'

const schema = yup.object({
  db: yup.object({
    host: yup.string().required(),
    // ...
  }),

  someService: yup.object({
    nestedSection: yup.object({
      option: yup.number(),
    })
  }),
})


const config = OmniConfig
  
  // Reads following environment variables names and maps to the above schema:
  //   - DB_HOST
  //   - SOME_SERVICE_NESTED_SECTION_OPTION
        
  .useEnvironmentVariables({
    envMapper: {
      prefix:        '',  // defaults
      separator:     '_',
      wordSeparator: '_',
    }
  })
  //...

const config2 = OmniConfig
  
  // Reads following environment variables names and maps to the above schema:
  //   - APP__DB__HOST
  //   - APP__SOME_SERVICE__NESTED_SECTION__OPTION
        
  .useEnvironmentVariables({
    envMapper: {
      prefix:        'APP__',
      separator:     '__',
      wordSeparator: '_',
    }
  })
  //...
```

Alternatively, you can use mappers that does not rely on the metadata (so you can use dynamic schemas):
  * [CamelCaseEnvMapper](src/loaders/env/envMappers/snakeCaseEnvMapper.ts) - to map camelcase object keys to environment variables
  * [SnakeCaseEnvMapper](src/loaders/env/envMappers/snakeCaseEnvMapper.ts) - to map snakecase object keys to environment variables

### `.useJsonFiles(template: string | ConfigFileVariantFn): OmniConfig`

Loads configuration from JSON files. 

As the template, you can pass:
* `string` - file name template for JSON files ([syntax](#file-name-template-syntax)) 
* `ConfigFileVariantFn` - function returns path to file for given [context](src/common/variants.ts#L4)

```ts
import OmniConfig from 'omniconfig'

const config = OmniConfig
  //...
  .useJsonFiles('config/app[.node_env].json[.dist]')
  //.useJsonFiles(({ local, dist, nodeEnv }) => local ? 'very-custom-local-name.json' : 'app.json')
  //...
```

### `.useYamlFiles(template: string | ConfigFileVariantFn): OmniConfig`

> Required dependency: [js-yaml](https://github.com/nodeca/js-yaml)

Loads configuration from YAML files. 

As the template, you can pass:
* `string` - file name template for YAML files ([syntax](#file-name-template-syntax)) 
* `ConfigFileVariantFn` - function returns path to file for given [context](src/common/variants.ts#L4)

```ts
import OmniConfig from 'omniconfig'

const config = OmniConfig
  //...
  .useYamlFiles('config/app[.node_env].yml[.dist]')
  //.useJsonFiles(({ local, dist, nodeEnv }) => local ? 'very-custom-local-name.yml' : 'app.yml')
  //...
```

### `.resolve(options?: OmniConfigResolveOptions): Promise<Config>`

Asynchronously loads, merges, and validates configuration object.
Optionally prints a formatted error message in the console.

#### Options

##### `logger: OmniConfigResolveErrorLogger`

Logger instance used to print error messages.  
Default: `console`

##### `formatter: ErrorFormatter`

Instance of error formatter that formats validation error before it is passed to the logger. 
Default: `ChalkErrorFormatter` if `chalk` is available, otherwise: `TextErrorFormatter`

##### `exitCode: number`

Exit code. If provided, will be passed to `process.exit()`.
Otherwise, `process.exit()` will not be called.

Default: `undefined`

### `.resolveSync(options?: OmniConfigResolveOptions): Config`

Synchronously loads, merges, and validates configuration object.
Optionally prints a formatted error message in the console.

See [`.resolve()`](#resolveoptions-omniconfigresolveoptions-promiseconfig) for options reference.

## File name template syntax

File name templates allows to customize source file name, location and **variants** that should be loaded.

Templates support following placeholders:
* `[local]` - for local file variant (loaded AFTER the main file)
* `[dist]` - for dist file variant (loaded BEFORE the main file)
* `[node_env]` - environment-specific file variant (basing on `process.env.NODE_ENV` variable)

Additionally, you can add an arbitrary character after `[` or before `]` that should be inserted in the final name.

**Examples:**

* template `.env` loads:
  1. `.env`

* template `.env[.local]` loads:
  1. `.env`
  2. `.env.local`

* template `app.json[.dist]` loads:
  1. `app.json.dist`
  2. `app.json`

* template `app[.node_env].json` loads:
  1. `app.json`
  2. `app.development.json` (if `NODE_ENV=development`)

* template `config/[node_env.]app[.local].yml` loads:
  1. `config/app.yml`
  2. `config/app.local.yml`
  3. `config/development.app.yml` (if `NODE_ENV=development`)
  4. `config/development.app.local.yml` (if `NODE_ENV=development`)

