import { Utxos } from 'common/blockchain'
import { Plasma as PlasmaClient } from 'common/clients'
import Config from 'react-native-config'
import BN from 'bn.js'

jest.mock('@omisego/react-native-omg-js')

const { getUtxos } = PlasmaClient.ChildChain
const { TEST_ADDRESS } = Config

const mockGetUtxosResponse = resp => {
  getUtxos.mockReturnValueOnce(Promise.resolve(resp))
}

describe('Test Plasma Boundary', () => {
  test('getUtxos should return BN amount as a string', () => {
    const utxos = [
      {
        amount: new BN('5000000000000000000'),
        blknum: 1010,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1010000000000
      }
    ]
    mockGetUtxosResponse(utxos)

    return Utxos.get(TEST_ADDRESS).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000000000000',
          blknum: 1010,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1010000000000
        }
      ])
    })
  })

  test('getUtxos should return utxos where `utxo.currency` === `currency`', () => {
    const utxos = [
      {
        amount: new BN('5000000000000000000'),
        blknum: 1010,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1010000000000
      },
      {
        amount: new BN('10000000000000000'),
        blknum: 1006,
        currency: '0x0000000000000000000000000000000000000000',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1006000000000
      }
    ]
    mockGetUtxosResponse(utxos)

    const requestOptions = {
      currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5'
    }

    return Utxos.get(TEST_ADDRESS, requestOptions).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000000000000',
          blknum: 1010,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1010000000000
        }
      ])
    })
  })

  test('getUtxos should return all utxos if not given `currency`', () => {
    const utxos = [
      {
        amount: new BN('5000000000000000000'),
        blknum: 1010,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1010000000000
      },
      {
        amount: new BN('10000000000000000'),
        blknum: 1006,
        currency: '0x0000000000000000000000000000000000000000',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1006000000000
      }
    ]
    mockGetUtxosResponse(utxos)

    const requestOptions = {}

    return Utxos.get(TEST_ADDRESS, requestOptions).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000000000000',
          blknum: 1010,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1010000000000
        },
        {
          amount: '10000000000000000',
          blknum: 1006,
          currency: '0x0000000000000000000000000000000000000000',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1006000000000
        }
      ])
    })
  })

  test('getUtxos should return utxos where `utxo.currency` === `currency` and `utxo.utxo_pos` >= `fromUtxoPos`', () => {
    const utxos = [
      {
        amount: new BN('5000000000000000000'),
        blknum: 1010,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1010000000000
      },
      {
        amount: new BN('1000000000000000000'),
        blknum: 1008,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1008000000000
      },
      {
        amount: new BN('1000000000000000000'),
        blknum: 1007,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1007000000000
      },
      {
        amount: new BN('10000000000000000'),
        blknum: 1006,
        currency: '0x0000000000000000000000000000000000000000',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1006000000000
      }
    ]
    mockGetUtxosResponse(utxos)

    const requestOptions = {
      currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
      fromUtxoPos: 1008000000000
    }

    return Utxos.get(TEST_ADDRESS, requestOptions).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000000000000',
          blknum: 1010,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1010000000000
        },
        {
          amount: '1000000000000000000',
          blknum: 1008,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1008000000000
        }
      ])
    })
  })

  test('getUtxos should return utxos where `utxo.utxo_pos` >= `fromUtxoPos`', () => {
    const utxos = [
      {
        amount: new BN('5000000000000000000'),
        blknum: 1010,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1010000000000
      },
      {
        amount: new BN('1000000000000000000'),
        blknum: 1008,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1008000000000
      },
      {
        amount: new BN('10000000000000000'),
        blknum: 1006,
        currency: '0x0000000000000000000000000000000000000000',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1006000000000
      },
      {
        amount: new BN('1000000000000000000'),
        blknum: 1007,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1005000000000
      }
    ]
    mockGetUtxosResponse(utxos)

    const requestOptions = {
      fromUtxoPos: 1006000000000
    }
    return Utxos.get(TEST_ADDRESS, requestOptions).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000000000000',
          blknum: 1010,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1010000000000
        },
        {
          amount: '1000000000000000000',
          blknum: 1008,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1008000000000
        },
        {
          amount: '10000000000000000',
          blknum: 1006,
          currency: '0x0000000000000000000000000000000000000000',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1006000000000
        }
      ])
    })
  })

  test('getUtxos should sort utxos by `utxo_pos` in descending', () => {
    const utxos = [
      {
        amount: new BN('10000000000000000'),
        blknum: 1006,
        currency: '0x0000000000000000000000000000000000000000',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1010000000000
      },
      {
        amount: new BN('1000000000000000000'),
        blknum: 1008,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1020000000000
      },
      {
        amount: new BN('5000000000000000000'),
        blknum: 1010,
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        oindex: 0,
        owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
        txindex: 0,
        utxo_pos: 1030000000000
      }
    ]
    mockGetUtxosResponse(utxos)

    const requestOptions = {}
    return Utxos.get(TEST_ADDRESS, requestOptions).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000000000000',
          blknum: 1010,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1030000000000
        },
        {
          amount: '1000000000000000000',
          blknum: 1008,
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1020000000000
        },
        {
          amount: '10000000000000000',
          blknum: 1006,
          currency: '0x0000000000000000000000000000000000000000',
          oindex: 0,
          owner: '0x4522fb44c2ab359e76ecc75c22c9409690f12241',
          txindex: 0,
          utxo_pos: 1010000000000
        }
      ])
    })
  })

  test('mapByCurrency should returns a map of utxos with currency as a key', () => {
    const utxos = [
      {
        amount: '10000000000000000',
        currency: '0x0000000000000000000000000000000000000000',
        utxo_pos: 1,
        owner: TEST_ADDRESS
      },
      {
        amount: '1000000000000000000',
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        utxo_pos: 2,
        owner: TEST_ADDRESS
      },
      {
        amount: '5000000000000000000',
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        utxo_pos: 3,
        owner: TEST_ADDRESS
      }
    ]

    expect(Utxos.mapByCurrency(utxos)).toEqual({
      '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5': [
        {
          amount: '1000000000000000000',
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          utxo_pos: 2,
          owner: TEST_ADDRESS
        },
        {
          amount: '5000000000000000000',
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          utxo_pos: 3,
          owner: TEST_ADDRESS
        }
      ],
      '0x0000000000000000000000000000000000000000': [
        {
          amount: '10000000000000000',
          currency: '0x0000000000000000000000000000000000000000',
          utxo_pos: 1,
          owner: TEST_ADDRESS
        }
      ]
    })
  })

  test('filterOnlyGreaterThanMaximum should returns utxos with length > 1', () => {
    const utxosMap = {
      '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5': [
        {
          amount: '1000000000000000000',
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          utxo_pos: 2,
          owner: TEST_ADDRESS
        },
        {
          amount: '7000000000000000000',
          currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
          utxo_pos: 6,
          owner: TEST_ADDRESS
        }
      ],
      '0x0000000000000000000000000000000000000000': [
        {
          amount: '10000000000000000',
          currency: '0x0000000000000000000000000000000000000000',
          utxo_pos: 1,
          owner: TEST_ADDRESS
        }
      ]
    }
    expect(Utxos.filterOnlyGreaterThanMaximum(utxosMap, 1)).toEqual([
      utxosMap['0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5']
    ])
  })
})
