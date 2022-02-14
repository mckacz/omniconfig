# Example 02

Loading and merging configuration from:
  1. `.env` file
  2. optional `.env.local` file
  3. `process.env`

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
  "port": "3000",
  "db": {
    "host": "localhost",
    "port": "5432",
    "name": "foo",
    "username": "toor",
    "password": "dont-c0mmit-your-passwords"
  }
}

```

2. You can override the configuration variables using `.env.local` file.

```shell
cp .env.local.dist .env.local
npm start
```

Expected output:

```json5
{
  "port": "3000",
  "db": {
    "host": "localhost",
    "port": "5432",
    "name": "alternate_foo",          // from .env.local
    "username": "b1ff",               // from .env.local
    "password": "adorable-kitty-123"  // from .env.local
  },
  "someNewKey": "12345"               // from .env.local
}
```

3. You can also override passing some environment variable to the script:

```shell
APP__PORT=4000 APP__DB__PASSWORD=hax0r npm start
```

Expected output:

```json5
{
  "port": "4000",             // from environment variables
  "db": {
    "host": "localhost",
    "port": "5432",
    "name": "alternate_foo",  // from .env.local
    "username": "b1ff",       // from .env.local
    "password": "hax0r"       // from environment variables
  },
  "someNewKey": "12345"       // from .env.local
}
```
