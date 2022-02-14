# Example 01

Basic loading of configuration from `process.env`.

## Installation

```shell
npm i
```

## Running the example

1. Set some environment variables with `APP__` prefix

```shell
export APP__FOO=123
export APP__BAR__QUX=1
export APP__BAR__QUUX=2
```

2. Start the example.

```shell
npm start
```

Expected output:

```json5
{
  "bar": {
    "quux": "2",
    "qux": "1"
  },
  "foo": "123"
}
```

3. You can also pass environment variables directly to the script.

```shell
APP__BAZ=bazing npm start
```

Expected output (assuming that previously exported variables are also in-place):

```json5
{
  "bar": {
    "quux": "2",
    "qux": "1"
  },
  "baz": "bazing",
  "foo": "123"
}
```
