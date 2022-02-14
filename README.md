Confres
=======

Confres is a Framework-agnostic runtime configuration resolver with full TypeScript support.

> **tl;dr** :arrow_right: Check [this](./examples/05-presets) example :arrow_left: 

Features
--------

* load configuration from various sources
* merge loaded configuration objects 
* process / validate the final configuration
* exceptions with extensive information (eg. where and how was defined value that caused the error or how can be defined a missing value)
* configurable error message formatter
* fully extensible - supports custom loaders and processors 
* preconfigured resolvers

Supported data sources:
  * environment variables
  * `.env` files (using [dotenv](https://www.npmjs.com/package/dotenv))
  * JSON files

Supported processors:
  * [Yup](https://www.npmjs.com/package/yup) validator 

## Installation

You can get latest release with type definitions from NPM:

```
npm install confres@beta --save

# if you want to use Yub processor / validator
npm install yup --save

# if you want to have colorful error messages
npm install chalk@^4.0.0 --save
```

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

Resolver loads configuration using specified loaders, merges them in order and processes them with processors. 
If any loader or processor throw an exception, Resolver collects information about the cause and decorates
exception with these information.


### Error message formatter

Error message formatter is responsible for producing pretty human-readable message for the user
from exceptions decorated by Resolver.
