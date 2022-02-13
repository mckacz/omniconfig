Confres
=======

Confres is a Framework-agnostic runtime configuration resolver with full TypeScript support.

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
