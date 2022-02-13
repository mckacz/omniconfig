Confres
=======

Confres is a Framework-agnostic runtime configuration resolver with full TypeScript support.

> :warning: **Work in progress**, the API still may change. :warning:

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
