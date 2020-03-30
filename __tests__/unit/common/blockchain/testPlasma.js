import { Plasma, Contract } from 'common/blockchain'
import { ContractABI } from 'common/utils'
import { Plasma as PlasmaClient, web3 } from 'common/clients'
import Config from 'react-native-config'
import BN from 'bn.js'
import { ContractAddress } from 'common/constants'

jest.mock('@omisego/react-native-omg-js')
jest.mock('common/blockchain/contract.js')

const { getBalance, getUtxos } = PlasmaClient.ChildChain
const { deposit, getErc20Vault } = PlasmaClient.RootChain
const { allowanceTokenForTransfer } = Contract
const { TEST_ADDRESS, TEST_PRIVATE_KEY, ERC20_VAULT_CONTRACT_ADDRESS } = Config

const FIVE_GWEI = '5000000000'

const mockGetBalancesResponse = resp => {
  getBalance.mockReturnValueOnce(Promise.resolve(resp))
}

const mockGetUtxosResponse = resp => {
  getUtxos.mockReturnValueOnce(Promise.resolve(resp))
}

const mockApprove = () => {
<<<<<<< HEAD
  allowanceTokenForTransfer.mockReturnValueOnce(Promise.resolve(false))
=======
  isApproved.mockReturnValueOnce(Promise.resolve(false))
>>>>>>> Fix tests
}

const mockDepositResponse = resp => {
  deposit.mockReturnValueOnce(Promise.resolve(resp))
}

const mockGetErc20Vault = resp => {
  getErc20Vault.mockReturnValueOnce(Promise.resolve(resp))
}

const mockWeb3SignTransaction = resp => {
  web3.eth.accounts.signTransaction = jest
    .fn()
    .mockReturnValueOnce(Promise.resolve(resp))
}

const mockWeb3SendSignedTransaction = resp => {
  web3.eth.sendSignedTransaction = jest
    .fn()
    .mockReturnValueOnce(Promise.resolve(resp))
}

describe('Test Plasma Boundary', () => {
  it('getBalances should return BN amount as a string', () => {
    const balances = [
      {
        amount: new BN('5000000000'),
        currency: '0x0000000000000000000000000000000000000000'
      }
    ]
    mockGetBalancesResponse(balances)

    return Plasma.getBalances(TEST_ADDRESS).then(data => {
      expect(data).toEqual([
        {
          amount: '5000000000',
          currency: '0x0000000000000000000000000000000000000000'
        }
      ])
    })
  })

  it('getUtxos should return BN amount as a string', () => {
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

    return Plasma.getUtxos(TEST_ADDRESS).then(data => {
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

  it('getUtxos should return utxos where `utxo.currency` === `currency`', () => {
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

    return Plasma.getUtxos(TEST_ADDRESS, requestOptions).then(data => {
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

  it('getUtxos should return all utxos if not given `currency`', () => {
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

    return Plasma.getUtxos(TEST_ADDRESS, requestOptions).then(data => {
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

  it('getUtxos should return utxos where `utxo.currency` === `currency` and `utxo.utxo_pos` >= `fromUtxoPos`', () => {
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

    return Plasma.getUtxos(TEST_ADDRESS, requestOptions).then(data => {
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

  it('getUtxos should return utxos where `utxo.utxo_pos` >= `fromUtxoPos`', () => {
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
    return Plasma.getUtxos(TEST_ADDRESS, requestOptions).then(data => {
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

  it('getUtxos should sort utxos by `utxo_pos` in descending', () => {
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
    return Plasma.getUtxos(TEST_ADDRESS, requestOptions).then(data => {
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

  it('getRequiredMergeUtxos should returns utxos with length > 1', () => {
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
      },
      {
        amount: '2000000000000000000',
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        utxo_pos: 4,
        owner: TEST_ADDRESS
      },
      {
        amount: '3000000000000000000',
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        utxo_pos: 5,
        owner: TEST_ADDRESS
      },
      {
        amount: '7000000000000000000',
        currency: '0xa1c9d0c6ed627fb2197fd16cd3afde37cc5e8da5',
        utxo_pos: 6,
        owner: TEST_ADDRESS
      }
    ]
    mockGetUtxosResponse(utxos)
    return Plasma.getRequiredMergeUtxos(TEST_ADDRESS, null, 4).then(
      arrayOfUtxos => {
        expect(arrayOfUtxos).toEqual([
          [utxos[5], utxos[4], utxos[3], utxos[2], utxos[1]]
        ])
      }
    )
  })

  it('deposit with eth should invoke the deposit function with expected parameters', () => {
    const from = TEST_ADDRESS
    const privateKey = TEST_PRIVATE_KEY
    const amount = FIVE_GWEI
    const gas = 30000
    const gasPrice = '6000000'

    mockDepositResponse({
      hash: 'any',
      from: 'any',
      to: 'any',
      blockNumber: 'any',
      blockHash: 'any',
      gasUsed: 'any'
    })

    return Plasma.deposit(
      from,
      privateKey,
      amount,
      ContractAddress.ETH_ADDRESS,
      {
        gas,
        gasPrice
      }
    ).then(_ => {
      expect(deposit).toBeCalledWith({
        amount,
        currency: ContractAddress.ETH_ADDRESS,
        txOptions: {
          from,
          gas,
          gasPrice,
          privateKey
        }
      })
    })
  })

  it('deposit with erc20 should invoke the deposit function with expected parameters', () => {
    const from = TEST_ADDRESS
    const privateKey = TEST_PRIVATE_KEY
    const amount = FIVE_GWEI
    const gas = 30000
    const gasPrice = '6000000'

    mockGetErc20Vault({ address: ERC20_VAULT_CONTRACT_ADDRESS })
    mockWeb3SignTransaction({ rawTransaction: 'rawTransaction' })
    mockWeb3SendSignedTransaction({ gasUsed: gas })
    mockApprove()
    mockDepositResponse({
      hash: 'any',
      from: 'any',
      to: 'any',
      blockNumber: 'any',
      blockHash: 'any',
      gasUsed: 'any'
    })

    const expectedApproveABIData = new web3.eth.Contract(
      ContractABI.erc20Abi(),
      ERC20_VAULT_CONTRACT_ADDRESS
    ).methods
      .approve(ERC20_VAULT_CONTRACT_ADDRESS, amount)
      .encodeABI()

    return Plasma.deposit(
      from,
      privateKey,
      amount,
      ERC20_VAULT_CONTRACT_ADDRESS,
      {
        gas,
        gasPrice
      }
    ).then(_ => {
      // Send Approve Transaction
      expect(web3.eth.accounts.signTransaction).toBeCalledWith(
        {
          data: expectedApproveABIData,
          from,
          gas,
          gasPrice,
          to: ERC20_VAULT_CONTRACT_ADDRESS
        },
        privateKey
      )

      expect(deposit).toBeCalledWith({
        amount,
        currency: ERC20_VAULT_CONTRACT_ADDRESS,
        txOptions: {
          from,
          gas,
          gasPrice,
          privateKey
        }
      })
    })
  })
})
