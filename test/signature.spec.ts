import * as assert from 'assert'
import * as BN from 'bn.js'
import {
  ecsign,
  ecrecover,
  privateToPublic,
  hashPersonalMessage,
  isValidSignature,
  fromRpcSig,
  toRpcSig,
} from '../src'

const echash = Buffer.from(
  '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28',
  'hex',
)
const ecprivkey = Buffer.from(
  '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
  'hex',
)
const chainId = 3 // ropsten

describe('ecsign', function() {
  it('should produce a signature', function() {
    const sig = ecsign(echash, ecprivkey)
    assert.deepEqual(
      sig.r,
      Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex'),
    )
    assert.deepEqual(
      sig.s,
      Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex'),
    )
    assert.equal(sig.v, 27)
  })

  it('should produce a signature for Ropsten testnet', function() {
    const sig = ecsign(echash, ecprivkey)
    assert.deepEqual(
      sig.r,
      Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex'),
    )
    assert.deepEqual(
      sig.s,
      Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex'),
    )
    assert.equal(sig.v, 27)
  })
})

describe('ecrecover', function() {
  it('should recover a public key', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    const pubkey = ecrecover(echash, v, r, s)
    assert.deepEqual(pubkey, privateToPublic(ecprivkey))
  })
  it('should recover a public key (chainId = 3)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    const pubkey = ecrecover(echash, v, r, s)
    assert.deepEqual(pubkey, privateToPublic(ecprivkey))
  })
  it('should fail on an invalid signature (v = 21)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function() {
      ecrecover(echash, 21, r, s)
    })
  })
  it('should fail on an invalid signature (v = 29)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function() {
      ecrecover(echash, 29, r, s)
    })
  })
  it('should fail on an invalid signature (swapped points)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function() {
      ecrecover(echash, 27, s, r)
    })
  })
})

describe('hashPersonalMessage', function() {
  it('should produce a deterministic hash', function() {
    const h = hashPersonalMessage(Buffer.from('Hello world'))
    assert.deepEqual(
      h,
      Buffer.from('710c3f393a54d09c1affcbb880167be54e6b346a5f21ec7472060b8f7ef43553', 'hex'),
    )
  })
})

describe('isValidSignature', function() {
  it('should fail on an invalid signature (shorter r))', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1ab', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.equal(isValidSignature(27, r, s), false)
  })
  it('should fail on an invalid signature (shorter s))', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca', 'hex')
    assert.equal(isValidSignature(27, r, s), false)
  })
  it('should fail on an invalid signature (v = 21)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.equal(isValidSignature(21, r, s), false)
  })
  it('should fail on an invalid signature (v = 29)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.equal(isValidSignature(29, r, s), false)
  })
  it('should fail when on homestead and s > secp256k1n/2', function() {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16,
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    assert.equal(isValidSignature(v, r, s, true), false)
  })
  it('should not fail when not on homestead but s > secp256k1n/2', function() {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16,
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    assert.equal(isValidSignature(v, r, s, false), true)
  })
  it('should work otherwise', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    assert.equal(isValidSignature(v, r, s), true)
  })
  it('should work otherwise(chainId=3)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    assert.equal(isValidSignature(v, r, s, false), true)
  })
  // FIXME: add homestead test
})

describe('message sig', function() {
  const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
  const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')

  it('should return hex strings that the RPC can use', function() {
    assert.equal(
      toRpcSig(27, r, s),
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca661b',
    )
    assert.deepEqual(
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca661b',
      ),
      {
        v: 27,
        r: r,
        s: s,
      },
    )
    assert.deepEqual(
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca6600',
      ),
      {
        v: 27,
        r: r,
        s: s,
      },
    )
  })

  it('should throw on invalid length', function() {
    assert.throws(function() {
      fromRpcSig('')
    })
    assert.throws(function() {
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca660042',
      )
    })
  })

  it('pad short r and s values', function() {
    assert.equal(
      toRpcSig(27, r.slice(20), s.slice(20)),
      '0x00000000000000000000000000000000000000004a1579cf389ef88b20a1abe90000000000000000000000000000000000000000326fa689f228040429e3ca661b',
    )
  })

  it('should throw on invalid v value', function() {
    assert.throws(function() {
      toRpcSig(1, r, s)
    })
  })
})
