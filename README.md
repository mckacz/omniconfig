Confres
=======

Confres is a Framework-agnostic runtime configuration resolver with full TypeScript support.

Features
--------

* load configuration from various sources
* merge loaded configuration objects
* process / validate the final configuration
* exceptions with extensive information (eg. where and how was defined value that caused the error or how can be defined
  a missing value)
* configurable error message formatter
* fully extensible - supports custom loaders and processors
* preconfigured resolvers
* synchronous and asynchronous API

Supported data sources:

* environment variables
* `.env` files (using [dotenv](https://www.npmjs.com/package/dotenv))
* JSON files

Supported processors:

* [Yup](https://www.npmjs.com/package/yup) validator

## Installation

You can get latest release with type definitions from NPM:

```
npm install confres --save

# if you want to use Yup processor / validator
npm install yup --save

# if you want to have colorful error messages
npm install chalk@^4.0.0 --save
```

## Example

Example usage of high level API with loading configuration from `process.env`, `.env` files, and validating them against
Yup schema.

Full runnable code can be found in [examples/00-readme-demo](./examples/00-readme-demo).

:bulb: Try to modify the values. For example export environment variable `APP__PORT=2000` and run the example.   
Try to set some incorrect value and see what happens.

```ts
import * as yup from 'yup'
import Confres from 'confres'

const schema = yup.object({
  port: yup.number().required().min(1024).max(4096).default(3000),
  db:   yup.object({
    host:     yup.string().required().default('localhost'),
    port:     yup.number().required().default(5432),
    name:     yup.string().required().default('app'),
    username: yup.string().required().default('app'),
    password: yup.string().required().default('app'),
  }).required(),
})

Confres.resolve(Confres.yupDotEnv({
  schema:    schema,
  keyMapper: {
    prefix:    'APP__',
    separator: '__',
  },
}))
  .then(config => {
    // The `config` is fully typed. Type is inferred automatically from Yup schema. 
    console.log(JSON.stringify(config, null, 2))
  })
  .catch(() => {
    return process.exit(1)
  })

// Output:
// {
//   "db": {
//     "password": "app",
//     "username": "app",
//     "name": "app",
//     "port": 5432,
//     "host": "localhost"
//   },
//   "port": 3000
// }
```

Check and test rest of [examples](./examples).

## High level API

### `resolve`

```ts
function resolve<T>(resolver: Resolver<T>, options?: HandleErrorsOptions): T
```

Resolves the configuration using provided resolver. If an error occurs, uses error formatter to display message to the
user.

Arguments:

* `resolver` (**required**) - configuration resolver (synchronous or asynchronous)
* `options`:
  * `formatter` - error formatter to use. Default value: `ChalkErrorFormatter` if `chalk` is installed
    or `TextErrorFormatter` otherwise.
  * `logger` - error logger. Default value: `console.error`.
  * `exitCode` - the exit code used when an error occurs. Default value: `undefined` (no exit on error).

### `yupEnv` and `yupEnvSync`

```ts
function yupEnv<TSchema extends AnyObjectSchema>(options: YupEnvPresetOptions<TSchema>): Resolver<Promise<Asserts<TSchema>>>
function yupEnvSync<TSchema extends AnyObjectSchema>(options: YupEnvPresetOptions<TSchema>): Resolver<Asserts<TSchema>> 
```

Create a preconfigured resolver that will:

1. load configuration from `process.env`
2. cast and validate it against provided Yup schema

Arguments:

* `options`:
  * `schema` (**required**) - Yup object schema of configuration
  * `keyMapper` - instance of `EnvKeyMapper` or options `CamelCaseKeyMapper`:
    * `prefix` - environment variables prefix. Default value: `''` (empty string, no prefix)
    * `separator` - nested keys separator. Default value: `__`.

### `yupDotEnv` and `yupDotEnvSync`

```ts
function yupDotEnv<TSchema extends AnyObjectSchema>(options: YupDotEnvPresetOptions<TSchema>): Resolver<Promise<Asserts<TSchema>>
function yupDotEnvSync<TSchema extends AnyObjectSchema>(options: YupDotEnvPresetOptions<TSchema>): Resolver<Asserts<TSchema>>
```

Create a preconfigured resolver that will:

1. load configuration from:
  * optional file `.env`
  * optional file `.env.local` (can be disabled)
  * optional file `.env.${NODE_ENV}` (can be disabled)
  * optional file `.env.${NODE_ENV}.local` (can be disabled)
  * `process.env` (can be disabled)
2. merges the configuration objects in order (the last source is most significant)
3. cast and validate it against provided Yup schema

Arguments:

* `options`:
  * `schema` (**required**) - Yup object schema of configuration
  * `keyMapper` - instance of `EnvKeyMapper` or options `CamelCaseKeyMapper`:
    * `prefix` - environment variables prefix. Default value: `''` (empty string, no prefix)
    * `separator` - nested keys separator. Default value: `__`.
  * `directory` - directory where `.env` files are placed. Default value: `./`.
  * `nodeEnvVariant` - enable loading `NODE_ENV`-based files. Default value: `true`
  * `localVariants` - enable loading `.local` files. Default value: `true`
  * `processEnv` - enable loading `process.env`. Default value: `true`

## Components

### Loaders

Loaders handle configuration from various sources.  
You can create your own loader by implementing [`Loader`](./src/loaders/loader.ts) interface.

#### Available loaders

| Class name                                                  | Description                          |
|-------------------------------------------------------------|--------------------------------------|
| [`ValueLoader`](./src/loaders/valueLoader.ts)               | Inline value loader.                 | 
| [`JsonFileLoader`](./src/loaders/json/jsonFileLoader.ts)    | Loads JSON files.                    |
| [`ProcessEnvLoader`](./src/loaders/env/processEnvLoader.ts) | Loads `process.env`.                 |
| [`DotEnvLoader`](./src/loaders/env/dotEnvLoader.ts)         | Loads `.env` files.                  |
| [`OptionalLoader`](./src/loaders/optionalLoader.ts)         | Makes any of above loaders optional. |

### Processors

Processors could transforms previously loaded configuration in any way.  
You can create your own processor by implementing [`Processor`](./src/processors/processor.ts) interface.

#### Available processors

| Class name                                         | Description                                                 |
|----------------------------------------------------|-------------------------------------------------------------|
| [`YupProcessor`](./src/processors/yupProcessor.ts) | Cast values and validates the configuration against schema. |

### Resolver

Resolver loads configuration using specified loaders, merges them in order and processes them with processors. If any
loader or processor throw an exception, Resolver collects information about the cause and decorates exception with these
information.

### Error message formatter

Error message formatter is responsible for producing pretty human-readable message for the user from exceptions
decorated by Resolver.
