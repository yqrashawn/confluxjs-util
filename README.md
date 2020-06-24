# SYNOPSIS

[![NPM Package](https://img.shields.io/npm/v/cfx-util.svg)](https://www.npmjs.org/package/cfx-util)
[![Actions Status](https://github.com/yqrashawn/confluxjs-util/workflows/Build/badge.svg)](https://github.com/yqrashawn/confluxjs-util/actions)

A collection of utility functions for Conflux. It can be used in Node.js and in the browser with [browserify](http://browserify.org/).

# INSTALL

`yarn add cfx-util` or `npm install cfx-util`

# USAGE

```js
import assert from 'assert'
import { isValidChecksumAddress, unpad, BN } from 'cfx-util'

const address = '0x2F015C60E0be116B1f0CD534704Db9c92118FB6A'
assert.ok(isValidChecksumAddress(address))

assert.equal(unpad('0000000006600'), '6600')

assert.equal(new BN('dead', 16).add(new BN('101010', 2)), 57047)
```

# API

## Documentation

### Modules

- [account](docs/modules/_account_.md)
  - Private/public key and address-related functionality (creation, validation, conversion)
- [bytes](docs/modules/_bytes_.md)
  - Byte-related helper and conversion functions
- [constants](docs/modules/_constants_.md)
  - Exposed constants
    - e.g. KECCAK256_NULL_S for string representation of Keccak-256 hash of null
- [hash](docs/modules/_hash_.md)
  - Hash functions
- [object](docs/modules/_object_.md)
  - Helper function for creating a binary object (`DEPRECATED`)
- [signature](docs/modules/_signature_.md)
  - Signing, signature validation, conversion, recovery
- [externals](docs/modules/_externals_.md)
  - Helper methods from `ethjs-util`
  - Re-exports of `BN`, `rlp`, `secp256k1`

### ethjs-util methods

The following methods are available provided by [ethjs-util](https://github.com/ethjs/ethjs-util):

- arrayContainsArray
- toBuffer
- getBinarySize
- stripHexPrefix
- isHexPrefixed
- isHexString
- padToEven
- intToHex
- fromAscii
- fromUtf8
- toUtf8
- toAscii
- getKeys

### Re-Exports

Additionally `cfx-util` re-exports a few commonly-used libraries. These include:

- `BN` ([bn.js](https://github.com/indutny/bn.js))
- `rlp` ([rlp](https://github.com/ethereumjs/rlp))
- `secp256k1` ([secp256k1](https://github.com/cryptocoinjs/secp256k1-node/))

# LICENSE

MPL-2.0
