# Example 03

Loading and merging configuration from:
  1. `.env` file
  2. optional `.env.local` file
  3. `process.env`
... and then validate it using `yup`. 

## Installation

```shell
npm i
```

## Running the example

1. Start the example.

```shell
npm start
```

Expected output:

```json5
{
  "db": {
    "password": "dont-c0mmit-your-passwords",
    "username": "toor",
    "name": "foo",
    "port": 5432,           // casted to number
    "host": "localhost"
  },
  "port": 3000,             // casted to number
  "debug": false            // from default value of Yup schema  
}
```

Take note of value types that have been casted to type expected by the schema.

2. Override some variables.

```shell
APP__DEBUG=1 APP__PORT=4000 npm start
```

Expected output:

```json5
{
  "db": {
    "password": "dont-c0mmit-your-passwords",
    "username": "toor",
    "name": "foo",
    "port": 5432,        // casted to number
    "host": "localhost"
  },
  "port": 4000,          // from environment variables casted to number
  "debug": true          // from environment variables casted to boolean
}
```

3. Set invalid value:

```shell
APP__PORT=512 npm start
```

Expected output:

```
ResolverError: port must be greater than or equal to 1024

[rest of error stack trace]
```
