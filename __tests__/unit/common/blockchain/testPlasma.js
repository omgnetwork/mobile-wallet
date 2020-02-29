import { Plasma } from 'common/blockchain'
import { ContractABI } from 'common/utils'
import { Plasma as PlasmaClient, PlasmaUtils, web3 } from 'common/clients'
import Config from 'react-native-config'
import BN from 'bn.js'
import { ContractAddress } from 'common/constants'

jest.mock('@omisego/omg-js')

const { getBalance, getUtxos } = PlasmaClient.ChildChain
const { deposit, getErc20Vault } = PlasmaClient.RootChain
const { encodeDeposit } = PlasmaUtils.transaction
const {
  TEST_ADDRESS,
  TEST_PRIVATE_KEY,
  TEST_ERC20_TOKEN_CONTRACT_ADDRESS,
  TEST_ERC20_VAULT_ADDRESS
} = Config

const FIVE_GWEI = '5000000000'

const mockGetBalancesResponse = resp => {
  getBalance.mockReturnValueOnce(Promise.resolve(resp))
}

const mockGetUtxosResponse = resp => {
  getUtxos.mockReturnValueOnce(Promise.resolve(resp))
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
    const tokenContractAddress = TEST_ERC20_TOKEN_CONTRACT_ADDRESS
    const amount = FIVE_GWEI
    const gas = 30000
    const gasPrice = '6000000'

    mockGetErc20Vault({ address: TEST_ERC20_VAULT_ADDRESS })
    mockWeb3SignTransaction({ rawTransaction: 'rawTransaction' })
    mockWeb3SendSignedTransaction({ gasUsed: gas })
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
      tokenContractAddress
    ).methods
      .approve(TEST_ERC20_VAULT_ADDRESS, amount)
      .encodeABI()

    return Plasma.deposit(from, privateKey, amount, tokenContractAddress, {
      gas,
      gasPrice
    }).then(_ => {
      // Send Approve Transaction
      expect(web3.eth.accounts.signTransaction).toBeCalledWith(
        {
          data: expectedApproveABIData,
          from,
          gas,
          gasPrice,
          to: tokenContractAddress
        },
        privateKey
      )

      expect(deposit).toBeCalledWith({
        amount,
        currency: tokenContractAddress,
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
