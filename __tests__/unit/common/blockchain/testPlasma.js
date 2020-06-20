import { Plasma, Contract, Utxos } from 'common/blockchain'
import { Plasma as PlasmaClient } from 'common/clients'
import Config from 'react-native-config'
import BN from 'bn.js'
import { GasEstimator } from 'common/blockchain'
import { Wait } from 'common/blockchain'
import { ContractAddress } from 'common/constants'

jest.mock('common/blockchain/gasEstimator.js')
jest.mock('common/blockchain/wait.js')
jest.mock('@omisego/react-native-omg-js')
jest.mock('common/blockchain/contract.js')

const { getBalance, getUtxos } = PlasmaClient.ChildChain
const { deposit, getErc20Vault } = PlasmaClient.RootChain
const { getErc20Allowance } = Contract
const { TEST_ADDRESS, TEST_PRIVATE_KEY } = Config

const FIVE_GWEI = '5000000000'

const mockGetBalancesResponse = resp => {
  getBalance.mockReturnValueOnce(Promise.resolve(resp))
}

const mockGetUtxosResponse = resp => {
  getUtxos.mockReturnValueOnce(Promise.resolve(resp))
}

const mockAllowance = resp => {
  getErc20Allowance.mockReturnValueOnce(Promise.resolve(resp))
}

const mockApproveToken = resp => {
  PlasmaClient.RootChain.approveToken.mockReturnValue(Promise.resolve(resp))
}

const mockWaitToBeSkipped = () => {
  Wait.waitForRootchainTransaction.mockReturnValue(Promise.resolve())
}

const mockDepositGasEstimated = resp => {
  GasEstimator.estimateDeposit.mockReturnValueOnce(Promise.resolve(resp))
}

const mockDepositReceipt = resp => {
  deposit.mockReturnValueOnce(Promise.resolve(resp))
}

const mockGetErc20Vault = resp => {
  getErc20Vault.mockReturnValueOnce(Promise.resolve(resp))
}

describe('Test Plasma Boundary', () => {
  test('getBalances should return BN amount as a string', () => {
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

  test('getRequiredMerge should returns utxos with length > 1', () => {
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
    return Utxos.getRequiredMerge(TEST_ADDRESS, null, 4).then(arrayOfUtxos => {
      expect(arrayOfUtxos).toEqual([
        [utxos[5], utxos[4], utxos[3], utxos[2], utxos[1]]
      ])
    })
  })

  test('deposit should invoke the deposit function with expected parameters', () => {
    const from = TEST_ADDRESS
    const privateKey = TEST_PRIVATE_KEY
    const amount = FIVE_GWEI
    const gasPrice = '6000000'
    const estimateGasUsedDeposit = 168000
    const depositReceipt = {
      transactionHash: 'transactionHash',
      from: 'any',
      to: 'any',
      blockNumber: 'any',
      blockHash: 'any'
    }

    mockDepositGasEstimated(estimateGasUsedDeposit)
    mockDepositReceipt(depositReceipt)

    return Plasma.deposit(
      from,
      privateKey,
      amount,
      ContractAddress.ETH_ADDRESS,
      {
        gasPrice
      }
    ).then(resp => {
      expect(deposit).toBeCalledWith({
        amount,
        currency: ContractAddress.ETH_ADDRESS,
        txOptions: {
          from,
          gas: estimateGasUsedDeposit,
          gasPrice,
          privateKey
        }
      })
      expect(resp).toEqual({
        ...depositReceipt,
        hash: depositReceipt.transactionHash,
        gasPrice
      })
    })
  })

  test('approve should call approveToken twice if 0 < allowance < amount', () => {
    const erc20Address = Config.TEST_ERC20_TOKEN_CONTRACT_ADDRESS
    const amount = '1000000'
    const txOptions = {
      from: '0x1234',
      privateKey: 'privateKey',
      gas: 50000,
      gasPrice: 100000
    }
    const allowance = 500000

    mockWaitToBeSkipped()
    mockGetErc20Vault({ address: Config.ERC20_VAULT_CONTRACT_ADDRESS })
    mockAllowance(allowance)
    mockApproveToken({
      transactionHash: 'transactionHash'
    })

    return Plasma.approveErc20Deposit(erc20Address, amount, txOptions).then(
      () => {
        expect(PlasmaClient.RootChain.approveToken).toBeCalledWith({
          erc20Address,
          amount: 0,
          txOptions
        })
        expect(PlasmaClient.RootChain.approveToken).toBeCalledWith({
          erc20Address,
          amount,
          txOptions
        })
      }
    )
  })

  test('approve should call approveToken once if allowance === 0', () => {
    const erc20Address = Config.TEST_ERC20_TOKEN_CONTRACT_ADDRESS
    const amount = '1000000'
    const txOptions = {
      from: '0x1234',
      privateKey: 'privateKey',
      gas: 50000,
      gasPrice: 100000
    }
    const allowance = 0

    mockWaitToBeSkipped()
    mockGetErc20Vault({ address: Config.ERC20_VAULT_CONTRACT_ADDRESS })
    mockAllowance(allowance)
    mockApproveToken({
      transactionHash: 'transactionHash'
    })

    return Plasma.approveErc20Deposit(erc20Address, amount, txOptions).then(
      () => {
        expect(PlasmaClient.RootChain.approveToken).toBeCalledWith({
          erc20Address,
          amount,
          txOptions
        })
      }
    )
  })
})
